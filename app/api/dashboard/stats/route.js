import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.message }, { status: authResult.status })
    }

    // Get counts for dashboard stats
    const [projectCount, skillCount, messageCount, unreadMessageCount] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
    ])

    // Get recent activity
    const recentProjects = await prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    })

    const recentMessages = await prisma.message.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, subject: true, createdAt: true, read: true },
    })

    return NextResponse.json({
      stats: {
        projects: projectCount,
        skills: skillCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
      },
      recentActivity: {
        projects: recentProjects,
        messages: recentMessages,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
