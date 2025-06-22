"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Award, Calendar, ExternalLink, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch("/api/certificates")
        if (response.ok) {
          const data = await response.json()
          setCertificates(data)
        }
      } catch (error) {
        console.error("Error fetching certificates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const filteredCertificates = certificates.filter((cert) => {
    if (activeTab === "all") return true
    if (activeTab === "featured") return cert.featured
    if (activeTab === "active") return !isExpired(cert.expiryDate)
    if (activeTab === "expired") return isExpired(cert.expiryDate)
    return true
  })

  const groupedCertificates = filteredCertificates.reduce((acc, cert) => {
    const year = new Date(cert.issueDate).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(cert)
    return acc
  }, {})

  const sortedYears = Object.keys(groupedCertificates).sort((a, b) => b - a)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white">
      {/* Header */}
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-900/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold">Certificates & Achievements</h1>
            <p className="text-gray-300 mt-2">Professional certifications and learning milestones</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariant}>
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-400">{certificates.length}</div>
                <div className="text-sm text-gray-300">Total Certificates</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-400">
                  {certificates.filter((cert) => !isExpired(cert.expiryDate)).length}
                </div>
                <div className="text-sm text-gray-300">Active</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {certificates.filter((cert) => cert.featured).length}
                </div>
                <div className="text-sm text-gray-300">Featured</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-400">{sortedYears.length}</div>
                <div className="text-sm text-gray-300">Years Active</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-purple-900/50 rounded-xl">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-700 rounded-xl">
                All ({certificates.length})
              </TabsTrigger>
              <TabsTrigger value="featured" className="data-[state=active]:bg-purple-700 rounded-xl">
                Featured ({certificates.filter((cert) => cert.featured).length})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-purple-700 rounded-xl">
                Active ({certificates.filter((cert) => !isExpired(cert.expiryDate)).length})
              </TabsTrigger>
              <TabsTrigger value="expired" className="data-[state=active]:bg-purple-700 rounded-xl">
                Expired ({certificates.filter((cert) => isExpired(cert.expiryDate)).length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Certificates */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-purple-950/30 border-purple-800/50 rounded-2xl animate-pulse">
                <div className="h-48 bg-purple-900/50 rounded-t-2xl"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-purple-700 rounded mb-2"></div>
                  <div className="h-4 bg-purple-700 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-purple-700 rounded"></div>
                    <div className="h-6 w-20 bg-purple-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCertificates.length === 0 ? (
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400">No certificates found for this filter</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <motion.div key={year} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-purple-400" />
                  {year}
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {groupedCertificates[year].map((certificate) => (
                    <motion.div key={certificate.id} variants={itemVariant}>
                      <Card className="bg-purple-950/30 border-purple-800/50 overflow-hidden hover:shadow-purple-500/20 hover:shadow-lg transition-all rounded-2xl h-full">
                        <div className="h-48 bg-gradient-to-r from-purple-900 to-indigo-900 relative">
                          {certificate.imageUrl ? (
                            <Image
                              src={certificate.imageUrl || "/placeholder.svg"}
                              alt={certificate.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Award className="h-16 w-16 text-purple-300" />
                            </div>
                          )}
                          {certificate.featured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-600 text-yellow-100 rounded-xl">Featured</Badge>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            {isExpired(certificate.expiryDate) ? (
                              <Badge className="bg-red-600 text-red-100 rounded-xl">
                                <Clock className="h-3 w-3 mr-1" />
                                Expired
                              </Badge>
                            ) : (
                              <Badge className="bg-green-600 text-green-100 rounded-xl">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-6 flex flex-col flex-grow">
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold mb-2">{certificate.title}</h3>
                            <p className="text-purple-400 font-medium mb-2">{certificate.issuer}</p>
                            {certificate.description && (
                              <p className="text-gray-300 text-sm mb-4">{certificate.description}</p>
                            )}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar className="h-4 w-4" />
                                Issued: {formatDate(certificate.issueDate)}
                              </div>
                              {certificate.expiryDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  Expires: {formatDate(certificate.expiryDate)}
                                </div>
                              )}
                            </div>
                            {certificate.skills && certificate.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {certificate.skills.map((skill, index) => (
                                  <Badge key={index} className="bg-purple-700 rounded-xl text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {certificate.credentialUrl && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 rounded-xl w-full" asChild>
                              <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Credential
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
