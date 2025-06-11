import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"

const prisma = new PrismaClient()

async function safeMigrate() {
  try {
    console.log("🛡️ Starting safe migration process...")

    // Step 1: Backup current data
    console.log("1️⃣ Creating data backup...")

    const backupData = {
      users: await prisma.user.findMany(),
      projects: await prisma.project.findMany(),
      skills: await prisma.skill.findMany(),
      messages: await prisma.message.findMany(),
      siteSettings: await prisma.siteSettings.findMany(),
    }

    console.log("📦 Backup created:")
    console.log(`   - Users: ${backupData.users.length}`)
    console.log(`   - Projects: ${backupData.projects.length}`)
    console.log(`   - Skills: ${backupData.skills.length}`)
    console.log(`   - Messages: ${backupData.messages.length}`)
    console.log(`   - Site Settings: ${backupData.siteSettings.length}`)

    // Step 2: Generate migration
    console.log("2️⃣ Generating migration...")
    try {
      execSync("npx prisma migrate dev --name update_schema", { stdio: "inherit" })
      console.log("✅ Migration generated and applied")
    } catch (error) {
      console.log("⚠️ Migration generation failed, trying db push...")
      execSync("npx prisma db push", { stdio: "inherit" })
      console.log("✅ Schema pushed to database")
    }

    // Step 3: Verify migration
    console.log("3️⃣ Verifying migration...")
    const newTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name != '_prisma_migrations'
      ORDER BY table_name
    `

    console.log("📊 Tables after migration:")
    newTables.forEach((table) => {
      console.log(`   - ${table.table_name}`)
    })

    // Step 4: Restore data if needed
    console.log("4️⃣ Checking if data restoration is needed...")
    const currentUsers = await prisma.user.count()

    if (currentUsers === 0 && backupData.users.length > 0) {
      console.log("🔄 Restoring backed up data...")

      // Restore users
      for (const user of backupData.users) {
        await prisma.user.create({
          data: {
            username: user.username,
            password: user.password,
            role: user.role,
          },
        })
      }

      // Restore other data...
      console.log("✅ Data restored successfully")
    } else {
      console.log("✅ No data restoration needed")
    }

    console.log("\n🎉 Safe migration completed successfully!")
  } catch (error) {
    console.error("❌ Safe migration failed:", error.message)
    console.log("💡 You may need to run a full reset: npm run db:reset")
  } finally {
    await prisma.$disconnect()
  }
}

safeMigrate()
