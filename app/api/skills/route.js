import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request) {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching skills:", error)
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
    if (!data.name || !data.color) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new skill
    const newSkill = await prisma.skill.create({
      data: {
        name: data.name,
        color: data.color,
        category: data.category || null,
        level: data.level || 1,
      },
    })

    return NextResponse.json(newSkill)
  } catch (error) {
    console.error("Error creating skill:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Skill already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
