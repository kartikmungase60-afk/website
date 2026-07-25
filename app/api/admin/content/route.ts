import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/app/lib/admin-auth"
import { JsonValue, readEditableSections, writeEditableSection } from "@/app/lib/admin-data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

function revalidateSite() {
  revalidatePath("/", "layout")
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const sections = await readEditableSections()
  return NextResponse.json({ sections })
}

export async function PUT(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const sectionId = typeof body?.sectionId === "string" ? body.sectionId : ""
  const data = body?.data as JsonValue | undefined

  if (!sectionId || data === undefined || data === null || typeof data !== "object") {
    return NextResponse.json({ error: "Section data must be a JSON object or array." }, { status: 400 })
  }

  try {
    const section = await writeEditableSection(sectionId, data)
    revalidateSite()
    return NextResponse.json({ section })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save section."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
