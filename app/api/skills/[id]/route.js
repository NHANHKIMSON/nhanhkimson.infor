import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error("Error fetching skill:", error)
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

    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!existingSkill) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 })
    }

    // Update skill
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
        category: data.category || null,
        level: data.level || 1,
      },
    })

    return NextResponse.json(updatedSkill)
  } catch (error) {
    console.error("Error updating skill:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Skill name already exists" }, { status: 400 })
    }
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

    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!existingSkill) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 })
    }

    // Delete skill
    const deletedSkill = await prisma.skill.delete({
      where: { id },
    })

    return NextResponse.json(deletedSkill)
  } catch (error) {
    console.error("Error deleting skill:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
