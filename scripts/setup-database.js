import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log("🔗 Testing database connection...")

    // Test the connection
    await prisma.$connect()
    console.log("✅ Database connection successful!")

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    console.log("📋 Existing tables:", tables)

    if (tables.length === 0) {
      console.log("🏗️  No tables found. Please run 'npx prisma db push' to create tables.")
    } else {
      console.log("✅ Database tables exist!")
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)

    if (error.message.includes("ENOTFOUND")) {
      console.log("🔍 DNS resolution failed. Check your internet connection and database URL.")
    } else if (error.message.includes("authentication")) {
      console.log("🔐 Authentication failed. Check your database credentials.")
    } else if (error.message.includes("SSL")) {
      console.log("🔒 SSL connection issue. Make sure sslmode=require is in your DATABASE_URL.")
    }
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
