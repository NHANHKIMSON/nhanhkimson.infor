import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

// Secret key for JWT verification - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function verifyAuth(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        message: "Authorization header missing or invalid",
        status: 401,
      }
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    if (!token) {
      return {
        success: false,
        message: "Token missing",
        status: 401,
      }
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET)

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, role: true },
      })

      if (!user) {
        return {
          success: false,
          message: "User not found",
          status: 401,
        }
      }

      // Check if user has admin role
      if (user.role !== "admin") {
        return {
          success: false,
          message: "Insufficient permissions",
          status: 403,
        }
      }

      return {
        success: true,
        user: user,
      }
    } catch (error) {
      return {
        success: false,
        message: "Invalid or expired token",
        status: 401,
      }
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return {
      success: false,
      message: "Internal server error",
      status: 500,
    }
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId, username, role) {
  return jwt.sign(
    {
      userId,
      username,
      role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}
