import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.message }, { status: authResult.status })
    }

    const { id } = params
    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error fetching message:", error)
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

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id },
    })

    if (!existingMessage) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    // Update message (typically just marking as read)
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        read: data.read !== undefined ? data.read : existingMessage.read,
      },
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error("Error updating message:", error)
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

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id },
    })

    if (!existingMessage) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 })
    }

    // Delete message
    const deletedMessage = await prisma.message.delete({
      where: { id },
    })

    return NextResponse.json(deletedMessage)
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
