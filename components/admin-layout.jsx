"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, FolderKanban, Code, Mail, Settings, LogOut, Menu, X, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Projects",
      href: "/admin/dashboard?tab=projects",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      name: "Skills",
      href: "/admin/dashboard?tab=skills",
      icon: <Code className="h-5 w-5" />,
    },
    {
      name: "Messages",
      href: "/admin/dashboard?tab=messages",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/dashboard?tab=settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-purple-900/50 hover:bg-purple-800"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 z-40 w-64 bg-purple-950/90 backdrop-blur-md border-r border-purple-800/50 lg:hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-800"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-800 transition-colors"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-800 transition-colors"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>View Site</span>
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-800 transition-colors w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <motion.div
          initial={false}
          animate={{ width: isSidebarOpen ? 240 : 80 }}
          className={cn(
            "h-full bg-purple-950/90 backdrop-blur-md border-r border-purple-800/50 transition-all duration-300",
            isSidebarOpen ? "w-60" : "w-20",
          )}
        >
          <div className="flex flex-col h-full p-4">
            <div className={cn("flex items-center", isSidebarOpen ? "justify-between" : "justify-center")}>
              {isSidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <ChevronRight className={cn("h-5 w-5 transition-transform", !isSidebarOpen && "rotate-180")} />
              </Button>
            </div>
            <nav className="space-y-2 mt-8 flex-1">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-800 transition-colors",
                    !isSidebarOpen && "justify-center",
                  )}
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-800 transition-colors",
                  !isSidebarOpen && "justify-center",
                )}
              >
                <Home className="h-5 w-5" />
                {isSidebarOpen && <span>View Site</span>}
              </Link>
            </nav>
            <button
              onClick={onLogout}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-800 transition-colors",
                !isSidebarOpen && "justify-center",
              )}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", isSidebarOpen ? "lg:ml-60" : "lg:ml-20")}>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  )
}
