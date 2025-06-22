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

    // 3. Clear existing data and create sample projects
    console.log("📁 Creating sample projects...")

    // Clear existing projects first
    await prisma.project.deleteMany({})

    const projects = [
      {
        title: "E-Commerce Platform",
        description:
          "A full-stack e-commerce platform with user authentication, product management, and payment integration built with modern technologies.",
        tech: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
        featured: true,
        githubUrl: "https://github.com/NHANHKIMSON/School-System-Python",
        liveUrl: "https://cambodiaschoolsystem.onrender.com/?added=True",
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

    // Create projects one by one
    for (const project of projects) {
      await prisma.project.create({
        data: project,
      })
    }
    console.log(`✅ Created ${projects.length} sample projects`)

    // 4. Clear existing skills and create new ones
    console.log("🛠️ Creating skills...")

    // Clear existing skills first
    await prisma.skill.deleteMany({})

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

    // Create skills one by one
    for (const skill of skills) {
      await prisma.skill.create({
        data: skill,
      })
    }
    console.log(`✅ Created ${skills.length} skills`)

    // 5. Clear existing messages and create sample messages
    console.log("💬 Creating sample messages...")

    // Clear existing messages first
    await prisma.message.deleteMany({})

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

    // Create messages one by one
    for (const message of messages) {
      await prisma.message.create({
        data: message,
      })
    }
    console.log(`✅ Created ${messages.length} sample messages`)

    // 6. Clear existing certificates and create sample certificates
    console.log("🏆 Creating sample certificates...")

    // Clear existing certificates first
    await prisma.certificate.deleteMany({})

    const certificates = [
      {
        title: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        description: "Validates expertise in developing and maintaining applications on the AWS platform.",
        issueDate: new Date("2023-06-15"),
        expiryDate: new Date("2026-06-15"),
        skills: ["AWS", "Cloud Computing", "Lambda", "DynamoDB", "S3"],
        featured: true,
        credentialUrl: "https://aws.amazon.com/verification",
      },
      {
        title: "Oracle Certified Professional, Java SE Developer",
        issuer: "Oracle Corporation",
        description: "Demonstrates proficiency in Java SE development and programming fundamentals.",
        issueDate: new Date("2023-03-20"),
        expiryDate: new Date("2026-03-20"),
        skills: ["Java", "Object-Oriented Programming", "Spring Framework"],
        featured: true,
        credentialUrl: "https://education.oracle.com/certification",
      },
      {
        title: "Microsoft Certified: Azure Fundamentals",
        issuer: "Microsoft",
        description:
          "Validates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
        issueDate: new Date("2023-01-10"),
        skills: ["Azure", "Cloud Computing", "Microsoft Technologies"],
        featured: false,
        credentialUrl: "https://docs.microsoft.com/en-us/learn/certifications/",
      },
    ]

    // Create certificates one by one
    for (const certificate of certificates) {
      await prisma.certificate.create({
        data: certificate,
      })
    }
    console.log(`✅ Created ${certificates.length} sample certificates`)

    // 7. Create site settings
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

    // 8. Final statistics
    const stats = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.message.count(),
      prisma.certificate.count(),
      prisma.user.count(),
    ])

    console.log("\n🎉 Database setup completed successfully!")
    console.log("📊 Final Statistics:")
    console.log(`   - Projects: ${stats[0]}`)
    console.log(`   - Skills: ${stats[1]}`)
    console.log(`   - Messages: ${stats[2]}`)
    console.log(`   - Certificates: ${stats[3]}`)
    console.log(`   - Users: ${stats[4]}`)
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
