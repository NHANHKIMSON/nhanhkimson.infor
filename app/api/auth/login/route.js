import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username, user.role)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
