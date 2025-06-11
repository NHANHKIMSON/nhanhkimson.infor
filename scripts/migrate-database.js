import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkMigrationStatus() {
  try {
    console.log("🔍 Checking current migration status...")

    // Check if _prisma_migrations table exists
    const migrationTable = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      )
    `

    const hasMigrationTable = migrationTable[0].exists

    if (hasMigrationTable) {
      console.log("✅ Migration system is initialized")

      // Get migration history
      const migrations = await prisma.$queryRaw`
        SELECT migration_name, finished_at, applied_steps_count 
        FROM _prisma_migrations 
        ORDER BY finished_at DESC
      `

      console.log("📋 Migration history:")
      if (migrations.length === 0) {
        console.log("   No migrations applied yet")
      } else {
        migrations.forEach((migration, index) => {
          console.log(`   ${index + 1}. ${migration.migration_name} (${migration.applied_steps_count} steps)`)
        })
      }
    } else {
      console.log("⚠️  Migration system not initialized")
      console.log("   Run 'npx prisma migrate dev --name init' to initialize")
    }

    // Check current schema state
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name != '_prisma_migrations'
      ORDER BY table_name
    `

    console.log("\n📊 Current database tables:")
    if (tables.length === 0) {
      console.log("   No application tables found")
    } else {
      tables.forEach((table) => {
        console.log(`   - ${table.table_name}`)
      })
    }
  } catch (error) {
    console.error("❌ Error checking migration status:", error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkMigrationStatus()
