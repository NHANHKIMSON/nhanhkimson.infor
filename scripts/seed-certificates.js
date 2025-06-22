import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedCertificates() {
  try {
    console.log("🏆 Seeding certificates...")

    // Clear existing certificates
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
      {
        title: "Google Cloud Professional Cloud Architect",
        issuer: "Google Cloud",
        description:
          "Validates ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions.",
        issueDate: new Date("2022-11-05"),
        expiryDate: new Date("2024-11-05"),
        skills: ["Google Cloud Platform", "Cloud Architecture", "Kubernetes"],
        featured: true,
        credentialUrl: "https://cloud.google.com/certification",
      },
      {
        title: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation",
        description:
          "Validates skills, knowledge, and competency to perform the responsibilities of Kubernetes administrators.",
        issueDate: new Date("2022-08-15"),
        expiryDate: new Date("2025-08-15"),
        skills: ["Kubernetes", "Container Orchestration", "DevOps"],
        featured: false,
        credentialUrl: "https://www.cncf.io/certification/cka/",
      },
      {
        title: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta (Facebook)",
        description: "Comprehensive program covering modern front-end development with React and responsive design.",
        issueDate: new Date("2022-05-20"),
        skills: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
        featured: false,
        credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      },
    ]

    for (const certificate of certificates) {
      await prisma.certificate.create({
        data: certificate,
      })
    }

    console.log(`✅ Created ${certificates.length} sample certificates`)
    console.log("🎉 Certificate seeding completed!")
  } catch (error) {
    console.error("❌ Error seeding certificates:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCertificates()
