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

    console.log("Updating certificate with ID:", id)
    console.log("Update data received:", data)

    // Check if certificate exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id },
    })

    if (!existingCertificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 })
    }

    // Validate required fields
    if (!data.title || !data.issuer || !data.issueDate) {
      return NextResponse.json({ message: "Title, issuer, and issue date are required" }, { status: 400 })
    }

    // Prepare update data with better date handling
    const updateData = {
      title: data.title,
      issuer: data.issuer,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      credentialUrl: data.credentialUrl || null,
      issueDate: new Date(data.issueDate),
      expiryDate: data.expiryDate && data.expiryDate !== "" ? new Date(data.expiryDate) : null,
      skills: Array.isArray(data.skills) ? data.skills : data.skills ? data.skills.split(",").map((s) => s.trim()) : [],
      featured: Boolean(data.featured),
    }

    console.log("Prepared update data:", updateData)

    // Update certificate
    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: updateData,
    })

    console.log("Certificate updated successfully:", updatedCertificate.id)
    return NextResponse.json(updatedCertificate)
  } catch (error) {
    console.error("Error updating certificate:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
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
