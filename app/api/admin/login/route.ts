import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, createAdminSessionToken, getAdminCookieOptions, verifyAdminLogin } from "@/app/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email : ""
  const password = typeof body?.password === "string" ? body.password : ""
  const token = typeof body?.token === "string" ? body.token : undefined
  const user = await verifyAdminLogin(email, password, token)

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials or 2FA code." }, { status: 401 })
  }

  if ("requires2FA" in user && user.requires2FA) {
    return NextResponse.json({ requires2FA: true }, { status: 401 })
  }

  const response = NextResponse.json({ user })
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(user as any), getAdminCookieOptions())
  return response
}
