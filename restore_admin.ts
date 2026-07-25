import { MongoClient } from "mongodb"
import { createHash, randomBytes } from "crypto"
import dotenv from "dotenv"

dotenv.config()

async function restore() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env")
    process.exit(1)
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    
    const db = client.db()
    const collection = db.collection("admin_users")

    const email = "kartikmungase290@gmail.com"
    const password = "07610761"
    
    // Check if user exists
    const existing = await collection.findOne({ email })
    
    if (existing) {
      console.log(`User ${email} already exists. Resetting password and ensuring admin role.`)
      
      const salt = randomBytes(16).toString("hex")
      const passwordHash = createHash("sha256").update(`${salt}:${password}`).digest("hex")

      await collection.updateOne(
        { email },
        { 
          $set: { 
            role: "admin", 
            salt, 
            passwordHash 
          } 
        }
      )
      console.log(`Password reset to: ${password}`)
    } else {
      console.log(`User ${email} not found. Re-creating...`)
      const salt = randomBytes(16).toString("hex")
      const passwordHash = createHash("sha256").update(`${salt}:${password}`).digest("hex")
      
      await collection.insertOne({
        id: "owner-admin",
        name: "Kartik Admin",
        email,
        role: "admin",
        salt,
        passwordHash,
        createdAt: new Date().toISOString(),
      })
      console.log(`User recreated with password: ${password}`)
    }
    
    console.log("Done! You can now log in.")
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await client.close()
  }
}

restore()
