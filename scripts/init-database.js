import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    console.log("🚀 Initializing database connection...")

    // Test connection
    await prisma.$connect()
    console.log("✅ Successfully connected to Neon PostgreSQL!")

    // Check if we can query the database
    const result = await prisma.$queryRaw`SELECT version()`
    console.log("📊 Database version:", result[0].version)

    // Check current tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("📋 Current tables in database:")
    if (tables.length === 0) {
      console.log("   No tables found - database is empty")
      console.log("   Run 'npx prisma db push' to create tables")
    } else {
      tables.forEach((table) => {
        console.log(`   - ${table.table_name}`)
      })
    }
  } catch (error) {
    console.error("❌ Database initialization failed:")
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)

    // Provide specific troubleshooting based on error
    if (error.code === "P1001") {
      console.log("\n🔧 Troubleshooting steps:")
      console.log("1. Check your internet connection")
      console.log("2. Verify the DATABASE_URL in your .env file")
      console.log("3. Make sure Neon database is active (not sleeping)")
    } else if (error.code === "P1000") {
      console.log("\n🔧 Troubleshooting steps:")
      console.log("1. Verify database credentials are correct")
      console.log("2. Check if database 'neondb' exists")
      console.log("3. Ensure user has proper permissions")
    }
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()
