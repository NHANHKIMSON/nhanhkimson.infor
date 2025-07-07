import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const certificate = await prisma.certificate.findUnique({
      where: { id },
    })

    if (!certificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("Error fetching certificate:", error)
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

    // Check if certificate exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id },
    })

    if (!existingCertificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 })
    }

    // Update certificate
    const updatedCertificate = await prisma.certificate.update({
      where: { id },
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

    return NextResponse.json(updatedCertificate)
  } catch (error) {
    console.error("Error updating certificate:", error)
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

    // Check if certificate exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id },
    })

    if (!existingCertificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 })
    }

    // Delete certificate
    const deletedCertificate = await prisma.certificate.delete({
      where: { id },
    })

    return NextResponse.json(deletedCertificate)
  } catch (error) {
    console.error("Error deleting certificate:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
