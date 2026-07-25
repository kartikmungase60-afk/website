import { mkdir, readFile, readdir, stat, writeFile } from "fs/promises"
import path from "path"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/app/lib/admin-auth"
import { editableSections } from "@/app/lib/admin-data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const rootDir = process.cwd()
const backupRoot = path.join(rootDir, "app", "config", "backups")

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

async function listBackups() {
  await mkdir(backupRoot, { recursive: true })
  const entries = await readdir(backupRoot, { withFileTypes: true })
  const backups = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const folder = path.join(backupRoot, entry.name)
        const stats = await stat(folder)
        return {
          id: entry.name,
          createdAt: stats.birthtime.toISOString(),
          path: path.relative(rootDir, folder).replaceAll("\\", "/"),
        }
      }),
  )
  return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  return NextResponse.json({ backups: await listBackups() })
}

export async function POST() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const folder = path.join(backupRoot, stamp)
  await mkdir(folder, { recursive: true })

  for (const section of editableSections) {
    const source = path.join(rootDir, section.file)
    const target = path.join(folder, `${section.id}.json`)
    await writeFile(target, await readFile(source, "utf8"), "utf8")
  }

  const usersFile = path.join(rootDir, "app", "config", "admin-users.json")
  await writeFile(path.join(folder, "admin-users.json"), await readFile(usersFile, "utf8"), "utf8")

  return NextResponse.json({ backups: await listBackups() })
}
