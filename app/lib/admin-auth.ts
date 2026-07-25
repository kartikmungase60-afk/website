import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto"
import { getDb } from "./mongodb"

export const ADMIN_COOKIE_NAME = "hostlixo_admin_session"

const sessionSecret = process.env.HOSTLIXO_ADMIN_SECRET || "hostlixo-local-admin-secret-change-this"
const sessionMaxAgeSeconds = 60 * 60 * 12

export type StoredAdminUser = {
  id: string
  name: string
  email: string
  role: "admin" | "editor"
  salt: string
  passwordHash: string
  createdAt: string
  twoFactorSecret?: string
  twoFactorEnabled?: boolean
}

export type SafeAdminUser = Omit<StoredAdminUser, "salt" | "passwordHash">

type UsersFile = {
  users: StoredAdminUser[]
}

type SessionPayload = SafeAdminUser & {
  expiresAt: number
}

function safeUser(user: StoredAdminUser): SafeAdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    twoFactorEnabled: user.twoFactorEnabled,
  }
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return {
    salt,
    passwordHash: createHash("sha256").update(`${salt}:${password}`).digest("hex"),
  }
}

async function ensureAdminUser() {
  const db = await getDb()
  const collection = db.collection("admin_users")
  
  const count = await collection.countDocuments()
  if (count === 0) {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "ChangeMeImmediately123!"
    const seeded = hashPassword(initialPassword, "hostlixo-local-admin")
    
    const initialEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@hostlixo.com"
    const initialName = process.env.ADMIN_INITIAL_NAME || "Admin"
    
    await collection.insertOne({
      id: "owner-admin",
      name: initialName,
      email: initialEmail,
      role: "admin",
      ...seeded,
      createdAt: new Date().toISOString(),
    })
  }
}

export async function readAdminUsers(): Promise<StoredAdminUser[]> {
  await ensureAdminUser()
  const db = await getDb()
  const collection = db.collection("admin_users")
  const users = await collection.find({}).toArray()
  
  return users as unknown as StoredAdminUser[]
}

export async function writeAdminUsers(users: StoredAdminUser[]) {
  const db = await getDb()
  const collection = db.collection("admin_users")
  
  await collection.deleteMany({})
  if (users.length > 0) {
    await collection.insertMany(users)
  }
}

export async function listSafeAdminUsers() {
  const users = await readAdminUsers()
  return users.map(safeUser)
}

export async function verifyAdminLogin(email: string, password: string, token?: string) {
  const users = await readAdminUsers()
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase())
  if (!user) return null

  const candidate = hashPassword(password, user.salt).passwordHash
  const storedBuffer = Buffer.from(user.passwordHash, "hex")
  const candidateBuffer = Buffer.from(candidate, "hex")
  if (storedBuffer.length !== candidateBuffer.length) return null
  if (!timingSafeEqual(storedBuffer, candidateBuffer)) return null

  if (user.twoFactorEnabled && user.twoFactorSecret) {
    if (!token) return { requires2FA: true }
    const { authenticator } = await import("otplib")
    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret })
    if (!isValid) return null
  }

  return safeUser(user)
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret).update(payload).digest("base64url")
}

export function createAdminSessionToken(user: SafeAdminUser) {
  const payload = base64UrlEncode(
    JSON.stringify({
      ...user,
      expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
    } satisfies SessionPayload),
  )
  return `${payload}.${sign(payload)}`
}

export function verifyAdminSessionToken(token?: string | null): SafeAdminUser | null {
  if (!token) return null
  const [payload, signature] = token.split(".")
  if (!payload || !signature || sign(payload) !== signature) return null

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as SessionPayload
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) return null
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      createdAt: parsed.createdAt,
      twoFactorEnabled: parsed.twoFactorEnabled,
    }
  } catch {
    return null
  }
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  }
}

export function createAdminUser(input: { name: string; email: string; password: string; role: "admin" | "editor" }): StoredAdminUser {
  const password = hashPassword(input.password)
  return {
    id: `admin-${Date.now()}-${randomBytes(4).toString("hex")}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    ...password,
    createdAt: new Date().toISOString(),
  }
}
