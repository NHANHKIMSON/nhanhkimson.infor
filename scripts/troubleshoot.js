import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

async function troubleshoot() {
  console.log("🔍 Troubleshooting database connection...")
  console.log("📍 DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set")

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL environment variable is not set!")
    console.log("💡 Make sure you have a .env file with your database URL")
    return
  }

  // Parse the URL to check components
  try {
    const url = new URL(process.env.DATABASE_URL)
    console.log("🔗 Database host:", url.hostname)
    console.log("🔗 Database port:", url.port || "5432")
    console.log("🔗 Database name:", url.pathname.slice(1))
    console.log("🔗 SSL mode:", url.searchParams.get("sslmode") || "not specified")
  } catch (error) {
    console.log("❌ Invalid DATABASE_URL format:", error.message)
    return
  }

  try {
    console.log("🔗 Attempting to connect...")
    await prisma.$connect()
    console.log("✅ Connection successful!")

    // Try a simple query
    console.log("📊 Testing query...")
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log("✅ Query successful:", result)

    // Check Prisma client generation
    console.log("🔧 Checking Prisma client...")
    console.log("✅ Prisma client is working!")
  } catch (error) {
    console.error("❌ Error:", error.message)
    console.error("📋 Full error:", error)

    // Common error solutions
    if (error.code === "P1001") {
      console.log("\n💡 Solutions:")
      console.log("1. Check your internet connection")
      console.log("2. Verify the database URL is correct")
      console.log("3. Make sure the database server is running")
    } else if (error.code === "P1000") {
      console.log("\n💡 Solutions:")
      console.log("1. Check database credentials")
      console.log("2. Verify database exists")
      console.log("3. Check firewall settings")
    }
  } finally {
    await prisma.$disconnect()
  }
}

troubleshoot()
