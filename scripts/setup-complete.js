import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function setupComplete() {
  try {
    console.log("🎯 Setting up complete portfolio database...")

    // 1. Test connection
    await prisma.$connect()
    console.log("✅ Database connected successfully!")

    // 2. Create admin user
    console.log("👤 Creating admin user...")
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: hashedPassword,
        role: "admin",
      },
    })
    console.log("✅ Admin user created:", adminUser.username)

    // 3. Create sample projects
    console.log("📁 Creating sample projects...")
    const projects = [
      {
        title: "E-Commerce Platform",
        description:
          "A full-stack e-commerce platform with user authentication, product management, and payment integration built with modern technologies.",
        tech: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
        featured: true,
        githubUrl: "https://github.com/NHANHKIMSON/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.vercel.app",
      },
      {
        title: "Task Management App",
        description:
          "A collaborative task management application with real-time updates, team collaboration features, and intuitive drag-and-drop interface.",
        tech: ["Vue.js", "Firebase", "Tailwind CSS", "Vuex"],
        featured: true,
        githubUrl: "https://github.com/NHANHKIMSON/task-manager",
        liveUrl: "https://task-manager-demo.vercel.app",
      },
      {
        title: "Portfolio Website",
        description:
          "A responsive portfolio website showcasing projects and skills with modern UI design, animations, and admin dashboard.",
        tech: ["Next.js", "Tailwind CSS", "Framer Motion", "Prisma"],
        featured: true,
        githubUrl: "https://github.com/NHANHKIMSON/portfolio",
        liveUrl: "https://nhanhkimson.vercel.app",
      },
      {
        title: "Weather Forecast App",
        description:
          "A weather forecast application that provides real-time weather data, forecasts, and interactive charts for any location worldwide.",
        tech: ["React", "OpenWeather API", "Chart.js", "Axios"],
        featured: false,
        githubUrl: "https://github.com/NHANHKIMSON/weather-app",
      },
    ]

    for (const project of projects) {
      await prisma.project.upsert({
        where: { title: project.title },
        update: {},
        create: project,
      })
    }
    console.log(`✅ Created ${projects.length} sample projects`)

    // 4. Create skills
    console.log("🛠️ Creating skills...")
    const skills = [
      { name: "Java Spring", color: "bg-green-600", category: "Backend", level: 4 },
      { name: "PHP Laravel", color: "bg-red-600", category: "Backend", level: 4 },
      { name: "C#", color: "bg-purple-600", category: "Backend", level: 3 },
      { name: "Python Flask", color: "bg-blue-600", category: "Backend", level: 3 },
      { name: "JavaScript", color: "bg-yellow-600", category: "Frontend", level: 5 },
      { name: "TypeScript", color: "bg-blue-500", category: "Frontend", level: 4 },
      { name: "React", color: "bg-cyan-500", category: "Frontend", level: 5 },
      { name: "Next.js", color: "bg-gray-800", category: "Frontend", level: 4 },
      { name: "Vue.js", color: "bg-green-500", category: "Frontend", level: 3 },
      { name: "HTML5", color: "bg-orange-600", category: "Frontend", level: 5 },
      { name: "CSS3", color: "bg-blue-400", category: "Frontend", level: 5 },
      { name: "Tailwind CSS", color: "bg-teal-600", category: "Frontend", level: 5 },
      { name: "MySQL", color: "bg-blue-700", category: "Database", level: 4 },
      { name: "PostgreSQL", color: "bg-blue-800", category: "Database", level: 4 },
      { name: "MongoDB", color: "bg-green-700", category: "Database", level: 3 },
      { name: "SQLite", color: "bg-gray-600", category: "Database", level: 4 },
      { name: "Git", color: "bg-orange-700", category: "Tools", level: 5 },
      { name: "GitHub", color: "bg-gray-800", category: "Tools", level: 5 },
      { name: "Docker", color: "bg-blue-600", category: "Tools", level: 3 },
      { name: "AWS", color: "bg-orange-600", category: "Cloud", level: 2 },
    ]

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { name: skill.name },
        update: {},
        create: skill,
      })
    }
    console.log(`✅ Created ${skills.length} skills`)

    // 5. Create sample messages
    console.log("💬 Creating sample messages...")
    const messages = [
      {
        name: "John Doe",
        email: "john.doe@techcorp.com",
        subject: "Job Opportunity - Senior Full Stack Developer",
        message:
          "Hi Nhanh, I'm impressed with your portfolio and would like to discuss a potential senior full stack developer position with our company. We're particularly interested in your experience with React and Node.js. Please let me know if you're interested in learning more.",
        read: false,
      },
      {
        name: "Sarah Johnson",
        email: "sarah@startupxyz.com",
        subject: "Collaboration Opportunity",
        message:
          "Hello! I'm working on an exciting fintech project that aligns perfectly with your skills. We're looking for a talented developer to join our team. Would you be interested in collaborating? I think we could create something amazing together.",
        read: false,
      },
      {
        name: "Mike Chen",
        email: "mike.chen@devstudio.com",
        subject: "Question about your E-commerce project",
        message:
          "I saw your e-commerce platform project and I'm really curious about the architecture you used. Could you share more details about how you implemented the payment integration with Stripe? Also, what was your approach to handling inventory management?",
        read: true,
      },
    ]

    for (const message of messages) {
      await prisma.message.create({
        data: message,
      })
    }
    console.log(`✅ Created ${messages.length} sample messages`)

    // 6. Create site settings
    console.log("⚙️ Creating site settings...")
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        siteName: "Nhanh Kimson Portfolio",
        siteTitle: "Software Engineer & Developer",
        description:
          "Personal portfolio of Nhanh Kimson, a passionate software engineer and developer specializing in full-stack development with expertise in Java Spring, PHP Laravel, C#, Python Flask, and modern web technologies.",
        email: "contact@nhanhkimson.com",
        githubUrl: "https://github.com/NHANHKIMSON",
        youtubeUrl: "https://www.youtube.com/@sonprogramming",
        location: "Cambodia",
      },
    })
    console.log("✅ Site settings created")

    // 7. Final statistics
    const stats = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.message.count(),
      prisma.user.count(),
    ])

    console.log("\n🎉 Database setup completed successfully!")
    console.log("📊 Final Statistics:")
    console.log(`   - Projects: ${stats[0]}`)
    console.log(`   - Skills: ${stats[1]}`)
    console.log(`   - Messages: ${stats[2]}`)
    console.log(`   - Users: ${stats[3]}`)
    console.log("\n🔐 Admin Login Credentials:")
    console.log("   Username: admin")
    console.log("   Password: admin123")
    console.log("\n🌐 Access your admin dashboard at: http://localhost:3000/admin")
  } catch (error) {
    console.error("❌ Setup failed:", error.message)
    console.error("Full error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

setupComplete()
