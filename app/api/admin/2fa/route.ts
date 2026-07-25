import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, readAdminUsers, writeAdminUsers, verifyAdminSessionToken } from "@/app/lib/admin-auth"
import { authenticator } from "otplib"
import qrcode from "qrcode"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(user.email, "Hostlixo Admin", secret)
  const qrCodeDataUrl = await qrcode.toDataURL(otpauth)

  return NextResponse.json({ secret, qrCodeDataUrl })
}

export async function POST(request: Request) {
  const currentUser = await requireAdmin()
  if (!currentUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const secret = body?.secret
  const token = body?.token

  if (!secret || !token) {
    return NextResponse.json({ error: "Secret and token are required." }, { status: 400 })
  }

  const isValid = authenticator.verify({ token, secret })
  if (!isValid) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 })
  }

  const users = await readAdminUsers()
  const targetUser = users.find((u) => u.id === currentUser.id)
  if (!targetUser) return NextResponse.json({ error: "User not found." }, { status: 404 })

  targetUser.twoFactorSecret = secret
  targetUser.twoFactorEnabled = true
  await writeAdminUsers(users)

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const currentUser = await requireAdmin()
  if (!currentUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const users = await readAdminUsers()
  const targetUser = users.find((u) => u.id === currentUser.id)
  if (!targetUser) return NextResponse.json({ error: "User not found." }, { status: 404 })

  targetUser.twoFactorSecret = undefined
  targetUser.twoFactorEnabled = false
  await writeAdminUsers(users)

  return NextResponse.json({ success: true })
}
