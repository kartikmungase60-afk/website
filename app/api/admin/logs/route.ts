import { NextResponse } from "next/server"
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/app/lib/admin-auth"
import { cookies } from "next/headers"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const user = verifyAdminSessionToken(token)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const logPath = path.join(process.cwd(), "server.log")
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ logs: "No server.log found yet." })
    }

    // Read the file. If it's too large, we should ideally read only the end.
    // For simplicity and assuming log rotation, we'll read up to the last 1MB.
    const stats = fs.statSync(logPath)
    const MAX_READ = 1024 * 1024 // 1MB
    const start = Math.max(0, stats.size - MAX_READ)
    
    const stream = fs.createReadStream(logPath, { start, encoding: "utf-8" })
    
    return new Promise<NextResponse>((resolve) => {
      let data = ""
      stream.on("data", (chunk) => {
        data += chunk
      })
      stream.on("end", () => {
        resolve(NextResponse.json({ logs: data }))
      })
      stream.on("error", () => {
        resolve(NextResponse.json({ error: "Failed to read logs." }, { status: 500 }))
      })
    })

  } catch (error) {
    return NextResponse.json({ error: "Could not read log file." }, { status: 500 })
  }
}
