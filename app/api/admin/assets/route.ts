import { unlink, writeFile } from "fs/promises"
import path from "path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/app/lib/admin-auth"
import { ensureUploadDirectory, listPublicImages } from "@/app/lib/admin-data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"])
const editableImageMimes = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
])

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const assets = await listPublicImages()
  return NextResponse.json({ assets })
}

export async function POST(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get("file") as any
    if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Upload an image file." }, { status: 400 })
    }

    const originalName = file.name || "image"
    const extension = path.extname(originalName).toLowerCase()
    if (!allowedExtensions.has(extension)) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 })
    }

    const safeBaseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image"
    const fileName = `${Date.now()}-${safeBaseName}${extension}`
    const uploadDir = await ensureUploadDirectory()
    const destination = path.join(uploadDir, fileName)
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(destination, bytes)

    return NextResponse.json({ path: `/uploads/admin/${fileName}`, assets: await listPublicImages() })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl : ""
  const requestedName = typeof body?.fileName === "string" ? body.fileName : "edited-image"
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/)

  if (!match) {
    return NextResponse.json({ error: "Save a PNG, JPG, or WebP image from the editor." }, { status: 400 })
  }

  const mime = match[1]
  const extension = editableImageMimes.get(mime)
  if (!extension) {
    return NextResponse.json({ error: "Unsupported edited image type." }, { status: 400 })
  }

  const bytes = Buffer.from(match[2], "base64")
  if (bytes.length > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "Edited image is too large. Keep it below 15 MB." }, { status: 400 })
  }

  const safeBaseName = path
    .basename(requestedName, path.extname(requestedName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "edited-image"
  const fileName = `${Date.now()}-${safeBaseName}${extension}`
  const uploadDir = await ensureUploadDirectory()
  await writeFile(path.join(uploadDir, fileName), bytes)

  return NextResponse.json({ path: `/uploads/admin/${fileName}`, assets: await listPublicImages() })
}

export async function DELETE(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const url = new URL(request.url)
  const assetPath = url.searchParams.get("path") || ""
  const publicDir = path.resolve(process.cwd(), "public")
  const target = path.resolve(publicDir, assetPath.replace(/^\/+/, ""))
  if (!target.startsWith(publicDir)) {
    return NextResponse.json({ error: "Invalid image path." }, { status: 400 })
  }

  await unlink(target).catch(() => undefined)
  return NextResponse.json({ assets: await listPublicImages() })
}
