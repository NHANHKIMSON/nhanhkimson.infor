import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.message }, { status: authResult.status })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.tech) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new project
    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        tech: Array.isArray(data.tech) ? data.tech : data.tech.split(",").map((t) => t.trim()),
        imageUrl: data.imageUrl || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        featured: data.featured || false,
      },
    })

    return NextResponse.json(newProject)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
