import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.message }, { status: authResult.status })
    }

    const { id } = params
    const data = await request.json()

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
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

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.message }, { status: authResult.status })
    }

    const { id } = params

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Delete project
    const deletedProject = await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json(deletedProject)
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
