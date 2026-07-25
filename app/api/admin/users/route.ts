import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  ADMIN_COOKIE_NAME,
  createAdminUser,
  hashPassword,
  listSafeAdminUsers,
  readAdminUsers,
  verifyAdminSessionToken,
  writeAdminUsers,
} from "@/app/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  return NextResponse.json({ users: await listSafeAdminUsers() })
}

export async function POST(request: Request) {
  const currentUser = await requireAdmin()
  if (!currentUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password : ""
  const role = body?.role === "editor" ? "editor" : "admin"

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 })
  }

  const users = await readAdminUsers()
  if (users.some((item) => item.email.toLowerCase() === email)) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 })
  }

  users.push(createAdminUser({ name, email, password, role }))
  await writeAdminUsers(users)
  return NextResponse.json({ users: await listSafeAdminUsers() })
}

export async function PATCH(request: Request) {
  const currentUser = await requireAdmin()
  if (!currentUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const body = await request.json().catch(() => null)
  const id = typeof body?.id === "string" ? body.id : ""
  
  const users = await readAdminUsers()
  const user = users.find((item) => item.id === id)
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })

  const SUPER_ADMIN = "kartikmungase290@gmail.com"
  const isSuperAdmin = currentUser.email === SUPER_ADMIN
  const targetIsSuperAdmin = user.email === SUPER_ADMIN

  if (targetIsSuperAdmin && !isSuperAdmin) {
    return NextResponse.json({ error: "Only the super-admin can modify this account." }, { status: 403 })
  }

  if (targetIsSuperAdmin) {
    if (typeof body?.name === "string" && body.name.trim()) user.name = body.name.trim()
    // Cannot change email or role for super admin
    if (typeof body?.password === "string" && body.password.length > 0) {
      const password = hashPassword(body.password)
      user.salt = password.salt
      user.passwordHash = password.passwordHash
    }
  } else {
    if (typeof body?.name === "string" && body.name.trim()) user.name = body.name.trim()
    if (typeof body?.email === "string" && body.email.trim()) user.email = body.email.trim().toLowerCase()
    if (body?.role === "admin" || body?.role === "editor") user.role = body.role
    if (typeof body?.password === "string" && body.password.length > 0) {
      const password = hashPassword(body.password)
      user.salt = password.salt
      user.passwordHash = password.passwordHash
    }
  }

  await writeAdminUsers(users)
  return NextResponse.json({ users: await listSafeAdminUsers() })
}

export async function DELETE(request: Request) {
  const currentUser = await requireAdmin()
  if (!currentUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "User id is required." }, { status: 400 })

  const users = await readAdminUsers()
  const targetUser = users.find((item) => item.id === id)

  if (!targetUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 })
  }

  const SUPER_ADMIN = "kartikmungase290@gmail.com"
  if (targetUser.email === SUPER_ADMIN) {
    return NextResponse.json({ error: "The super-admin account cannot be deleted." }, { status: 403 })
  }

  const nextUsers = users.filter((item) => item.id !== id)
  if (nextUsers.length === users.length) {
    return NextResponse.json({ error: "User not found." }, { status: 404 })
  }

  if (!nextUsers.some((item) => item.role === "admin")) {
    return NextResponse.json({ error: "At least one admin user is required." }, { status: 400 })
  }

  await writeAdminUsers(nextUsers)
  return NextResponse.json({ users: await listSafeAdminUsers() })
}
