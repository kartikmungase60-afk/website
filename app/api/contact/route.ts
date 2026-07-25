import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const attachment = formData.get("attachment") as File | null

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let attachmentUrl = null

    if (attachment && attachment.size > 0) {
      const arrayBuffer = await attachment.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const ext = path.extname(attachment.name) || ".png"
      const fileName = `${crypto.randomBytes(16).toString("hex")}${ext}`
      const uploadDir = path.join(process.cwd(), "public", "uploads")
      
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true })
      
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)
      attachmentUrl = `/uploads/${fileName}`
    }

    const messagesFile = path.join(process.cwd(), "app", "config", "messages.json")
    const messagesData = await fs.readFile(messagesFile, "utf-8")
    const messagesJson = JSON.parse(messagesData)

    const newMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      attachmentUrl,
      createdAt: new Date().toISOString(),
      status: "open"
    }

    messagesJson.messages.push(newMessage)

    await fs.writeFile(messagesFile, JSON.stringify(messagesJson, null, 2))

    return NextResponse.json({ success: true, message: "Message received" })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
