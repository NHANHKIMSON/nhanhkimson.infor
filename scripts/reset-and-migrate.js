import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"

const prisma = new PrismaClient()

async function resetAndMigrate() {
  try {
    console.log("🔄 Starting database reset and migration...")

    // Step 1: Check current state
    console.log("1️⃣ Checking current database state...")
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log(`   Found ${tables.length} existing tables`)

    // Step 2: Reset database (this will drop all tables)
    console.log("2️⃣ Resetting database...")
    console.log("   ⚠️  This will delete all existing data!")

    // Give user a chance to cancel
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("   Proceeding with reset...")
        resolve()
      }, 2000)
    })

    // Reset the database
    execSync("npx prisma migrate reset --force", { stdio: "inherit" })
    console.log("✅ Database reset completed")

    // Step 3: Apply migrations
    console.log("3️⃣ Applying migrations...")
    execSync("npx prisma migrate deploy", { stdio: "inherit" })
    console.log("✅ Migrations applied")

    // Step 4: Generate Prisma client
    console.log("4️⃣ Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })
    console.log("✅ Prisma client generated")

    // Step 5: Seed database
    console.log("5️⃣ Seeding database with sample data...")
    execSync("npm run db:setup", { stdio: "inherit" })
    console.log("✅ Database seeded")

    console.log("\n🎉 Database reset and migration completed successfully!")
    console.log("🔐 Admin credentials: admin / admin123")
    console.log("🌐 Access admin at: http://localhost:3000/admin")
  } catch (error) {
    console.error("❌ Reset and migration failed:", error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetAndMigrate()
