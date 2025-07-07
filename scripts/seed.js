// import { PrismaClient } from "@prisma/client"
// import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()

// async function main() {
//   console.log("🌱 Starting database seed...")

//   // Create admin user
//   const hashedPassword = await bcrypt.hash("admin123", 12)

//   const adminUser = await prisma.user.upsert({
//     where: { username: "admin" },
//     update: {},
//     create: {
//       username: "admin",
//       password: hashedPassword,
//       role: "admin",
//     },
//   })

//   console.log("✅ Admin user created:", adminUser.username)

//   // Create sample projects
//   const projects = [
//     {
//       title: "E-Commerce Platform",
//       description:
//         "A full-stack e-commerce platform with user authentication, product management, and payment integration.",
//       tech: ["React", "Node.js", "MongoDB", "Stripe"],
//       featured: true,
//     },
//     {
//       title: "Task Management App",
//       description:
//         "A collaborative task management application with real-time updates and team collaboration features.",
//       tech: ["Vue.js", "Firebase", "Tailwind CSS"],
//       featured: true,
//     },
//     {
//       title: "Portfolio Website",
//       description: "A responsive portfolio website showcasing projects and skills with a modern UI design.",
//       tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
//       featured: false,
//     },
//     {
//       title: "Weather Forecast App",
//       description:
//         "A weather forecast application that provides real-time weather data and forecasts for any location.",
//       tech: ["React", "OpenWeather API", "Chart.js"],
//       featured: false,
//     },
//   ]

//   for (const project of projects) {
//     await prisma.project.upsert({
//       where: { title: project.title },
//       update: {},
//       create: project,
//     })
//   }

//   console.log("✅ Sample projects created")

//   // Create sample skills
//   const skills = [
//     { name: "Java Spring", color: "bg-green-600", category: "Backend", level: 4 },
//     { name: "PHP Laravel", color: "bg-red-600", category: "Backend", level: 4 },
//     { name: "C#", color: "bg-purple-600", category: "Backend", level: 3 },
//     { name: "Python Flask", color: "bg-blue-600", category: "Backend", level: 3 },
//     { name: "JavaScript", color: "bg-yellow-600", category: "Frontend", level: 5 },
//     { name: "TypeScript", color: "bg-blue-500", category: "Frontend", level: 4 },
//     { name: "React", color: "bg-cyan-500", category: "Frontend", level: 5 },
//     { name: "Next.js", color: "bg-gray-800", category: "Frontend", level: 4 },
//     { name: "Vue.js", color: "bg-green-500", category: "Frontend", level: 3 },
//     { name: "MySQL", color: "bg-blue-700", category: "Database", level: 4 },
//     { name: "PostgreSQL", color: "bg-blue-800", category: "Database", level: 4 },
//     { name: "MongoDB", color: "bg-green-700", category: "Database", level: 3 },
//     { name: "Git", color: "bg-orange-700", category: "Tools", level: 5 },
//     { name: "Docker", color: "bg-blue-600", category: "Tools", level: 3 },
//     { name: "AWS", color: "bg-orange-600", category: "Cloud", level: 2 },
//     { name: "Tailwind CSS", color: "bg-teal-600", category: "Frontend", level: 5 },
//   ]

//   for (const skill of skills) {
//     await prisma.skill.upsert({
//       where: { name: skill.name },
//       update: {},
//       create: skill,
//     })
//   }

//   console.log("✅ Sample skills created")

//   // Create sample messages
//   const messages = [
//     {
//       name: "John Doe",
//       email: "john@example.com",
//       subject: "Job Opportunity",
//       message:
//         "Hi Nhanh, I'm impressed with your portfolio and would like to discuss a potential job opportunity with our company. Please let me know if you're interested.",
//       read: false,
//     },
//     {
//       name: "Jane Smith",
//       email: "jane@example.com",
//       subject: "Collaboration Request",
//       message:
//         "Hello! I'm working on a project that aligns with your skills. Would you be interested in collaborating? I think we could create something amazing together.",
//       read: false,
//     },
//     {
//       name: "Mike Johnson",
//       email: "mike@example.com",
//       subject: "Question about your project",
//       message:
//         "I saw your e-commerce platform project and I'm curious about the tech stack you used. Could you share more details about the implementation?",
//       read: true,
//     },
//   ]

//   for (const message of messages) {
//     await prisma.message.create({
//       data: message,
//     })
//   }

//   console.log("✅ Sample messages created")

//   // Create site settings
//   await prisma.siteSettings.upsert({
//     where: { id: "default" },
//     update: {},
//     create: {
//       id: "default",
//       siteName: "Nhanh Kimson Portfolio",
//       siteTitle: "Software Engineer & Developer",
//       description:
//         "Personal portfolio of Nhanh Kimson, a software engineer and developer specializing in Java Spring, PHP Laravel, C#, Python Flask, and more.",
//       email: "contact@nhanhkimson.com",
//       githubUrl: "https://github.com/NHANHKIMSON",
//       youtubeUrl: "https://www.youtube.com/@sonprogramming",
//     },
//   })

//   console.log("✅ Site settings created")

//   console.log("🎉 Database seeded successfully!")
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error seeding database:", e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })




# Update the seed script
cat > seed-db.cjs << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting database seeding...');

    // 1. Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Admin user created:', adminUser.username);

    // 2. Create sample projects
    console.log('📁 Creating sample projects...');
    
    // Clear existing projects first
    await prisma.project.deleteMany({});
    
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with user authentication, product management, and payment integration.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        featured: true,
        githubUrl: 'https://github.com/NHANHKIMSON/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.vercel.app',
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team collaboration features.',
        tech: ['Vue.js', 'Firebase', 'Tailwind CSS'],
        featured: true,
        githubUrl: 'https://github.com/NHANHKIMSON/task-manager',
        liveUrl: 'https://task-manager-demo.vercel.app',
      },
      {
        title: 'Portfolio Website',
        description: 'A responsive portfolio website showcasing projects and skills with a modern UI design.',
        tech: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
        featured: true,
        githubUrl: 'https://github.com/NHANHKIMSON/portfolio',
        liveUrl: 'https://nhanhkimson.vercel.app',
      },
    ];

    for (const project of projects) {
      await prisma.project.create({
        data: project,
      });
    }
    console.log('✅ Sample projects created');

    // 3. Create sample skills
    console.log('🛠️ Creating skills...');
    
    // Clear existing skills first
    await prisma.skill.deleteMany({});
    
    const skills = [
      { name: 'Java Spring', color: 'bg-green-600', category: 'Backend', level: 4 },
      { name: 'PHP Laravel', color: 'bg-red-600', category: 'Backend', level: 4 },
      { name: 'JavaScript', color: 'bg-yellow-600', category: 'Frontend', level: 5 },
      { name: 'React', color: 'bg-cyan-500', category: 'Frontend', level: 5 },
      { name: 'Next.js', color: 'bg-gray-800', category: 'Frontend', level: 4 },
      { name: 'MySQL', color: 'bg-blue-700', category: 'Database', level: 4 },
      { name: 'PostgreSQL', color: 'bg-blue-800', category: 'Database', level: 4 },
      { name: 'Git', color: 'bg-orange-700', category: 'Tools', level: 5 },
      { name: 'Tailwind CSS', color: 'bg-teal-600', category: 'Frontend', level: 5 },
      { name: 'TypeScript', color: 'bg-blue-500', category: 'Frontend', level: 4 },
    ];

    for (const skill of skills) {
      await prisma.skill.create({
        data: skill,
      });
    }
    console.log('✅ Sample skills created');

    // 4. Create sample messages
    console.log('💬 Creating sample messages...');
    
    // Clear existing messages first
    await prisma.message.deleteMany({});
    
    const messages = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Job Opportunity',
        message: 'Hi Nhanh, I am impressed with your portfolio and would like to discuss a potential job opportunity with our company.',
        read: false,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Collaboration Request',
        message: 'Hello! I am working on a project that aligns with your skills. Would you be interested in collaborating?',
        read: false,
      },
    ];

    for (const message of messages) {
      await prisma.message.create({
        data: message,
      });
    }
    console.log('✅ Sample messages created');

    // 5. Create site settings
    console.log('⚙️ Creating site settings...');
    
    // Clear existing settings first
    await prisma.siteSettings.deleteMany({});
    
    await prisma.siteSettings.create({
      data: {
        siteName: 'Nhanh Kimson Portfolio',
        siteTitle: 'Software Engineer & Developer',
        description: 'Personal portfolio of Nhanh Kimson, a software engineer and developer.',
        email: 'contact@nhanhkimson.com',
        githubUrl: 'https://github.com/NHANHKIMSON',
        youtubeUrl: 'https://www.youtube.com/@sonprogramming',
      },
    });
    console.log('✅ Site settings created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('🔐 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('🌐 Access your portfolio at: http://localhost:3000');
    console.log('🔧 Access admin dashboard at: http://localhost:3000/admin');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
EOF