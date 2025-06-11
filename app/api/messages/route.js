import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request) {
  try {
    // Verify authentication for admin access
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.message }, { status: authResult.status })
    }

    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new message
    const newMessage = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || "No Subject",
        message: data.message,
      },
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
