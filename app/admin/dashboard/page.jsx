"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, FolderKanban, Code, Mail, Settings, Plus, Trash2, Edit, Save, X, Award } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    certificates: 0,
  })
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [messages, setMessages] = useState([])
  const [certificates, setCertificates] = useState([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  })
  const [newSkill, setNewSkill] = useState({
    name: "",
    color: "bg-purple-600",
  })
  const [editingProject, setEditingProject] = useState(null)
  const [editingSkill, setEditingSkill] = useState(null)
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    issuer: "",
    description: "",
    imageUrl: "",
    credentialUrl: "",
    issueDate: "",
    expiryDate: "",
    skills: "",
    featured: false,
  })
  const [editingCertificate, setEditingCertificate] = useState(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }

    // Fetch dashboard data
    const fetchData = async () => {
      try {
        setError("")

        // Test basic API connectivity first
        console.log("Testing API connectivity...")

        // Fetch dashboard stats with better error handling
        const statsRes = await fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Stats response status:", statsRes.status)

        if (!statsRes.ok) {
          const errorData = await statsRes.json().catch(() => ({ message: "Unknown error" }))
          console.error("Stats API error:", errorData)

          if (statsRes.status === 401) {
            localStorage.removeItem("adminToken")
            router.push("/admin")
            return
          }

          throw new Error(`Failed to fetch dashboard stats: ${errorData.message}`)
        }

        const statsData = await statsRes.json()
        console.log("Stats data received:", statsData)
        setStats(statsData.stats)

        // Fetch projects
        const projectsRes = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData)
        } else {
          console.warn("Failed to fetch projects")
        }

        // Fetch skills
        const skillsRes = await fetch("/api/skills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json()
          setSkills(skillsData)
        } else {
          console.warn("Failed to fetch skills")
        }

        // Fetch messages
        const messagesRes = await fetch("/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json()
          setMessages(messagesData)
        } else {
          console.warn("Failed to fetch messages")
        }

        // Fetch certificates
        const certificatesRes = await fetch("/api/certificates", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (certificatesRes.ok) {
          const certificatesData = await certificatesRes.json()
          setCertificates(certificatesData)
        } else {
          console.warn("Failed to fetch certificates")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  const handleAddProject = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProject,
          tech: newProject.tech.split(",").map((item) => item.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add project")
      }

      const addedProject = await response.json()
      setProjects([...projects, addedProject])
      setStats({ ...stats, projects: stats.projects + 1 })
      setNewProject({
        title: "",
        description: "",
        tech: "",
        imageUrl: "",
        githubUrl: "",
        liveUrl: "",
        featured: false,
      })
    } catch (error) {
      console.error("Error adding project:", error)
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSkill),
      })

      if (!response.ok) {
        throw new Error("Failed to add skill")
      }

      const addedSkill = await response.json()
      setSkills([...skills, addedSkill])
      setStats({ ...stats, skills: stats.skills + 1 })
      setNewSkill({
        name: "",
        color: "bg-purple-600",
      })
    } catch (error) {
      console.error("Error adding skill:", error)
    }
  }

  const handleDeleteProject = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((project) => project.id !== id))
      setStats({ ...stats, projects: stats.projects - 1 })
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleDeleteSkill = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete skill")
      }

      setSkills(skills.filter((skill) => skill.id !== id))
      setStats({ ...stats, skills: stats.skills - 1 })
    } catch (error) {
      console.error("Error deleting skill:", error)
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editingProject,
          tech: Array.isArray(editingProject.tech)
            ? editingProject.tech
            : editingProject.tech.split(",").map((item) => item.trim()),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update project")
      }

      const updatedProject = await response.json()
      setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)))
      setEditingProject(null)
      console.log("✅ Project updated successfully")
    } catch (error) {
      console.error("Error updating project:", error)
      alert(`Error updating project: ${error.message}`)
    }
  }

  const handleUpdateSkill = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/skills/${editingSkill.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingSkill),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update skill")
      }

      const updatedSkill = await response.json()
      setSkills(skills.map((skill) => (skill.id === updatedSkill.id ? updatedSkill : skill)))
      setEditingSkill(null)
      console.log("✅ Skill updated successfully")
    } catch (error) {
      console.error("Error updating skill:", error)
      alert(`Error updating skill: ${error.message}`)
    }
  }

  const handleDeleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      setMessages(messages.filter((message) => message.id !== id))
      setStats({ ...stats, messages: stats.messages - 1 })
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const handleAddCertificate = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newCertificate,
          skills: newCertificate.skills.split(",").map((item) => item.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add certificate")
      }

      const addedCertificate = await response.json()
      setCertificates([...certificates, addedCertificate])
      setNewCertificate({
        title: "",
        issuer: "",
        description: "",
        imageUrl: "",
        credentialUrl: "",
        issueDate: "",
        expiryDate: "",
        skills: "",
        featured: false,
      })
    } catch (error) {
      console.error("Error adding certificate:", error)
    }
  }

  const handleDeleteCertificate = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/certificates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete certificate")
      }

      setCertificates(certificates.filter((certificate) => certificate.id !== id))
    } catch (error) {
      console.error("Error deleting certificate:", error)
    }
  }

  const handleUpdateCertificate = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/certificates/${editingCertificate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editingCertificate,
          skills: Array.isArray(editingCertificate.skills)
            ? editingCertificate.skills
            : editingCertificate.skills.split(",").map((item) => item.trim()),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update certificate")
      }

      const updatedCertificate = await response.json()
      setCertificates(
        certificates.map((certificate) =>
          certificate.id === updatedCertificate.id ? updatedCertificate : certificate,
        ),
      )
      setEditingCertificate(null)
      console.log("✅ Certificate updated successfully")
    } catch (error) {
      console.error("Error updating certificate:", error)
      alert(`Error updating certificate: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Dashboard Error</div>
          <div className="text-white mb-4">{error}</div>
          <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8 bg-purple-900/50 rounded-xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-700 rounded-xl">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-purple-700 rounded-xl">
            <FolderKanban className="mr-2 h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-purple-700 rounded-xl">
            <Code className="mr-2 h-4 w-4" /> Skills
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-purple-700 rounded-xl">
            <Award className="mr-2 h-4 w-4" /> Certificates
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-purple-700 rounded-xl">
            <Mail className="mr-2 h-4 w-4" /> Messages
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-700 rounded-xl">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={itemVariant}>
              <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.projects}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariant}>
              <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.skills}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariant}>
              <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.certificates}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariant}>
              <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">New Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.messages}</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest portfolio updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...projects, ...messages].slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-purple-900/20 rounded-xl">
                      {item.title ? (
                        <>
                          <FolderKanban className="h-5 w-5 text-purple-400" />
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-400">Project added</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Mail className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-400">New message received</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl mb-8">
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Project Title
                      </label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="Enter project title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="imageUrl" className="text-sm font-medium">
                        Image URL
                      </label>
                      <Input
                        id="imageUrl"
                        value={newProject.imageUrl}
                        onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="bg-purple-900/50 border-purple-700 rounded-xl"
                      placeholder="Enter project description"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tech" className="text-sm font-medium">
                      Technologies (comma separated)
                    </label>
                    <Input
                      id="tech"
                      value={newProject.tech}
                      onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                      className="bg-purple-900/50 border-purple-700 rounded-xl"
                      placeholder="React, Node.js, MongoDB"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="githubUrl" className="text-sm font-medium">
                        GitHub URL
                      </label>
                      <Input
                        id="githubUrl"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="liveUrl" className="text-sm font-medium">
                        Live Demo URL
                      </label>
                      <Input
                        id="liveUrl"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="https://your-project.vercel.app"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="rounded border-purple-700 bg-purple-900/50 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured Project (show on homepage)
                    </label>
                  </div>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div key={project.id || index} variants={itemVariant}>
                {editingProject && editingProject.id === project.id ? (
                  <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Edit Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProject} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="edit-title" className="text-sm font-medium">
                            Project Title
                          </label>
                          <Input
                            id="edit-title"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-description" className="text-sm font-medium">
                            Description
                          </label>
                          <Textarea
                            id="edit-description"
                            value={editingProject.description}
                            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-tech" className="text-sm font-medium">
                            Technologies
                          </label>
                          <Input
                            id="edit-tech"
                            value={
                              Array.isArray(editingProject.tech) ? editingProject.tech.join(", ") : editingProject.tech
                            }
                            onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value })}
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-imageUrl" className="text-sm font-medium">
                            Image URL
                          </label>
                          <Input
                            id="edit-imageUrl"
                            value={editingProject.imageUrl}
                            onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="edit-githubUrl" className="text-sm font-medium">
                              GitHub URL
                            </label>
                            <Input
                              id="edit-githubUrl"
                              value={editingProject.githubUrl || ""}
                              onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="edit-liveUrl" className="text-sm font-medium">
                              Live Demo URL
                            </label>
                            <Input
                              id="edit-liveUrl"
                              value={editingProject.liveUrl || ""}
                              onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                              placeholder="https://your-project.vercel.app"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-featured"
                            checked={editingProject.featured}
                            onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                            className="rounded border-purple-700 bg-purple-900/50 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="edit-featured" className="text-sm font-medium">
                            Featured Project (show on homepage)
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-xl">
                            <Save className="mr-2 h-4 w-4" /> Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800 rounded-xl"
                            onClick={() => setEditingProject(null)}
                          >
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(project.tech) ? (
                          project.tech.map((tech, techIndex) => (
                            <Badge key={techIndex} className="bg-purple-700 rounded-xl">
                              {tech}
                            </Badge>
                          ))
                        ) : (
                          <Badge className="bg-purple-700 rounded-xl">{project.tech}</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-400 hover:bg-blue-900/20 rounded-xl"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/20 rounded-xl"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl mb-8">
              <CardHeader>
                <CardTitle>Add New Skill</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="skill-name" className="text-sm font-medium">
                        Skill Name
                      </label>
                      <Input
                        id="skill-name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="Enter skill name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="skill-color" className="text-sm font-medium">
                        Color
                      </label>
                      <select
                        id="skill-color"
                        value={newSkill.color}
                        onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                        className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="bg-purple-600">Purple</option>
                        <option value="bg-blue-600">Blue</option>
                        <option value="bg-green-600">Green</option>
                        <option value="bg-red-600">Red</option>
                        <option value="bg-yellow-600">Yellow</option>
                        <option value="bg-orange-600">Orange</option>
                        <option value="bg-pink-600">Pink</option>
                        <option value="bg-indigo-600">Indigo</option>
                        <option value="bg-gray-600">Gray</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" /> Add Skill
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {skills.map((skill, index) => (
              <motion.div key={skill.id || index} variants={itemVariant}>
                {editingSkill && editingSkill.id === skill.id ? (
                  <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                    <CardContent className="pt-6">
                      <form onSubmit={handleUpdateSkill} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="edit-skill-name" className="text-sm font-medium">
                            Skill Name
                          </label>
                          <Input
                            id="edit-skill-name"
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-skill-color" className="text-sm font-medium">
                            Color
                          </label>
                          <select
                            id="edit-skill-color"
                            value={editingSkill.color}
                            onChange={(e) => setEditingSkill({ ...editingSkill, color: e.target.value })}
                            className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="bg-purple-600">Purple</option>
                            <option value="bg-blue-600">Blue</option>
                            <option value="bg-green-600">Green</option>
                            <option value="bg-red-600">Red</option>
                            <option value="bg-yellow-600">Yellow</option>
                            <option value="bg-orange-600">Orange</option>
                            <option value="bg-pink-600">Pink</option>
                            <option value="bg-indigo-600">Indigo</option>
                            <option value="bg-gray-600">Gray</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-xl">
                            <Save className="mr-2 h-4 w-4" /> Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800 rounded-xl"
                            onClick={() => setEditingSkill(null)}
                          >
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <div className={`${skill.color} rounded-2xl p-4 text-center relative group`}>
                    <span className="font-semibold">{skill.name}</span>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 mr-1"
                        onClick={() => setEditingSkill(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl mb-8">
              <CardHeader>
                <CardTitle>Add New Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCertificate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="cert-title" className="text-sm font-medium">
                        Certificate Title
                      </label>
                      <Input
                        id="cert-title"
                        value={newCertificate.title}
                        onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="AWS Certified Developer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cert-issuer" className="text-sm font-medium">
                        Issuer
                      </label>
                      <Input
                        id="cert-issuer"
                        value={newCertificate.issuer}
                        onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="Amazon Web Services"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cert-description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="cert-description"
                      value={newCertificate.description}
                      onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                      className="bg-purple-900/50 border-purple-700 rounded-xl"
                      placeholder="Certificate description"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="cert-imageUrl" className="text-sm font-medium">
                        Certificate Image URL
                      </label>
                      <Input
                        id="cert-imageUrl"
                        value={newCertificate.imageUrl}
                        onChange={(e) => setNewCertificate({ ...newCertificate, imageUrl: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="https://example.com/certificate.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cert-credentialUrl" className="text-sm font-medium">
                        Credential URL
                      </label>
                      <Input
                        id="cert-credentialUrl"
                        value={newCertificate.credentialUrl}
                        onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        placeholder="https://verify.certificate.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="cert-issueDate" className="text-sm font-medium">
                        Issue Date
                      </label>
                      <Input
                        id="cert-issueDate"
                        type="date"
                        value={newCertificate.issueDate}
                        onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cert-expiryDate" className="text-sm font-medium">
                        Expiry Date (Optional)
                      </label>
                      <Input
                        id="cert-expiryDate"
                        type="date"
                        value={newCertificate.expiryDate}
                        onChange={(e) => setNewCertificate({ ...newCertificate, expiryDate: e.target.value })}
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cert-skills" className="text-sm font-medium">
                      Related Skills (comma separated)
                    </label>
                    <Input
                      id="cert-skills"
                      value={newCertificate.skills}
                      onChange={(e) => setNewCertificate({ ...newCertificate, skills: e.target.value })}
                      className="bg-purple-900/50 border-purple-700 rounded-xl"
                      placeholder="AWS, Cloud Computing, DevOps"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cert-featured"
                      checked={newCertificate.featured}
                      onChange={(e) => setNewCertificate({ ...newCertificate, featured: e.target.checked })}
                      className="rounded border-purple-700 bg-purple-900/50 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="cert-featured" className="text-sm font-medium">
                      Featured Certificate
                    </label>
                  </div>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" /> Add Certificate
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {certificates.map((certificate, index) => (
              <motion.div key={certificate.id || index} variants={itemVariant}>
                {editingCertificate && editingCertificate.id === certificate.id ? (
                  <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Edit Certificate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateCertificate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="edit-cert-title" className="text-sm font-medium">
                              Certificate Title
                            </label>
                            <Input
                              id="edit-cert-title"
                              value={editingCertificate.title}
                              onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="edit-cert-issuer" className="text-sm font-medium">
                              Issuer
                            </label>
                            <Input
                              id="edit-cert-issuer"
                              value={editingCertificate.issuer}
                              onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-cert-description" className="text-sm font-medium">
                            Description
                          </label>
                          <Textarea
                            id="edit-cert-description"
                            value={editingCertificate.description || ""}
                            onChange={(e) =>
                              setEditingCertificate({ ...editingCertificate, description: e.target.value })
                            }
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="edit-cert-imageUrl" className="text-sm font-medium">
                              Certificate Image URL
                            </label>
                            <Input
                              id="edit-cert-imageUrl"
                              value={editingCertificate.imageUrl || ""}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, imageUrl: e.target.value })
                              }
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="edit-cert-credentialUrl" className="text-sm font-medium">
                              Credential URL
                            </label>
                            <Input
                              id="edit-cert-credentialUrl"
                              value={editingCertificate.credentialUrl || ""}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, credentialUrl: e.target.value })
                              }
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="edit-cert-issueDate" className="text-sm font-medium">
                              Issue Date
                            </label>
                            <Input
                              id="edit-cert-issueDate"
                              type="date"
                              value={
                                editingCertificate.issueDate
                                  ? new Date(editingCertificate.issueDate).toISOString().split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, issueDate: e.target.value })
                              }
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="edit-cert-expiryDate" className="text-sm font-medium">
                              Expiry Date (Optional)
                            </label>
                            <Input
                              id="edit-cert-expiryDate"
                              type="date"
                              value={
                                editingCertificate.expiryDate
                                  ? new Date(editingCertificate.expiryDate).toISOString().split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, expiryDate: e.target.value })
                              }
                              className="bg-purple-900/50 border-purple-700 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-cert-skills" className="text-sm font-medium">
                            Related Skills (comma separated)
                          </label>
                          <Input
                            id="edit-cert-skills"
                            value={
                              Array.isArray(editingCertificate.skills)
                                ? editingCertificate.skills.join(", ")
                                : editingCertificate.skills || ""
                            }
                            onChange={(e) => setEditingCertificate({ ...editingCertificate, skills: e.target.value })}
                            className="bg-purple-900/50 border-purple-700 rounded-xl"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-cert-featured"
                            checked={editingCertificate.featured}
                            onChange={(e) =>
                              setEditingCertificate({ ...editingCertificate, featured: e.target.checked })
                            }
                            className="rounded border-purple-700 bg-purple-900/50 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="edit-cert-featured" className="text-sm font-medium">
                            Featured Certificate
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-xl">
                            <Save className="mr-2 h-4 w-4" /> Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800 rounded-xl"
                            onClick={() => setEditingCertificate(null)}
                          >
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">{certificate.title}</CardTitle>
                      <p className="text-sm text-purple-400">{certificate.issuer}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-4">{certificate.description}</p>
                      <div className="text-sm text-gray-400 mb-4">
                        <p>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                        {certificate.expiryDate && (
                          <p>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      {certificate.skills && certificate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {certificate.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} className="bg-purple-700 rounded-xl">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-400 hover:bg-blue-900/20 rounded-xl"
                          onClick={() => setEditingCertificate(certificate)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/20 rounded-xl"
                          onClick={() => handleDeleteCertificate(certificate.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <motion.div key={message.id || index} variants={itemVariant}>
                  <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-medium">{message.name}</CardTitle>
                          <p className="text-sm text-gray-400">{message.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-red-900/20 text-red-400"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-2">{message.subject}</p>
                      <p className="text-sm border-l-2 border-purple-500 pl-3 py-1">{message.message}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Mail className="h-12 w-12 text-gray-500 mb-4" />
                  <p className="text-gray-400">No messages yet</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="bg-purple-950/30 border-purple-800/50 rounded-2xl">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your admin account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </label>
                      <Input
                        id="current-password"
                        type="password"
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="bg-purple-900/50 border-purple-700 rounded-xl"
                      />
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">Update Password</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Settings</h3>
                  <div className="space-y-2">
                    <label htmlFor="api-url" className="text-sm font-medium">
                      API URL
                    </label>
                    <div className="flex">
                      <Input
                        id="api-url"
                        value="https://api.yourportfolio.com"
                        readOnly
                        className="bg-purple-900/50 border-purple-700 rounded-l-xl"
                      />
                      <Button className="rounded-l-none rounded-r-xl">Copy</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="api-key" className="text-sm font-medium">
                      API Key
                    </label>
                    <div className="flex">
                      <Input
                        id="api-key"
                        value="••••••••••••••••••••••••••••••"
                        readOnly
                        className="bg-purple-900/50 border-purple-700 rounded-l-xl"
                      />
                      <Button className="rounded-l-none rounded-r-xl">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
