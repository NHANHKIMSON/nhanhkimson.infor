import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request) {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        issueDate: "desc",
      },
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error("Error fetching certificates:", error)
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
    if (!data.title || !data.issuer || !data.issueDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new certificate
    const newCertificate = await prisma.certificate.create({
      data: {
        title: data.title,
        issuer: data.issuer,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        credentialUrl: data.credentialUrl || null,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        skills: Array.isArray(data.skills) ? data.skills : data.skills?.split(",").map((s) => s.trim()) || [],
        featured: data.featured || false,
      },
    })

    return NextResponse.json(newCertificate)
  } catch (error) {
    console.error("Error creating certificate:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
