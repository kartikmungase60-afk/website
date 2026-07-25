import { promises as fs } from "fs"
import path from "path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/app/lib/admin-auth"
import { listPublicImages, readEditableSections } from "@/app/lib/admin-data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

async function getAllSourceCode(dir: string): Promise<string> {
  let content = ""
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      content += await getAllSourceCode(fullPath)
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      content += await fs.readFile(fullPath, "utf-8")
    }
  }
  return content
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  try {
    const allImages = await listPublicImages()
    const sections = await readEditableSections()
    const jsonString = JSON.stringify(sections)
    const sourceCode = await getAllSourceCode(path.join(process.cwd(), "app"))

    const combinedText = jsonString + sourceCode

    const unusedImages = allImages.filter((img) => {
      return !combinedText.includes(img)
    })

    return NextResponse.json({ unusedImages })
  } catch (error) {
    return NextResponse.json({ error: "Failed to scan for unused images." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const pathsToDelete = Array.isArray(body?.paths) ? body.paths : []

  const publicDir = path.resolve(process.cwd(), "public")
  let deletedCount = 0

  for (const assetPath of pathsToDelete) {
    if (typeof assetPath !== "string") continue
    const target = path.resolve(publicDir, assetPath.replace(/^\/+/, ""))
    if (target.startsWith(publicDir)) {
      await fs.unlink(target).catch(() => undefined)
      deletedCount++
    }
  }

  return NextResponse.json({ deletedCount, assets: await listPublicImages() })
}
