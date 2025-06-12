import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nhanh Kimson - Software Engineer & Developer",
  description:
    "Personal portfolio of Nhanh Kimson, a software engineer and developer specializing in Java Spring, PHP Laravel, C#, Python Flask, and more.",
  keywords: [
    "Nhanh Kimson",
    "Software Engineer",
    "Full Stack Developer",
    "Java",
    "Spring Boot",
    "Laravel",
    "C#",
    "Python",
    "Next.js",
    "Portfolio"
  ],
  generator: "v0.dev",
  authors: [{ name: "Nhanh Kimson", url: "https://nhanhkimson.dev" }],
  metadataBase: new URL("https://nhanhkimson-infor.vercel.app"),
  openGraph: {
    title: "Nhanh Kimson - Software Engineer & Developer",
    description:
      "Portfolio of Nhanh Kimson, showcasing software engineering projects using Java, Laravel, C#, Python, and more.",
    url: "https://nhanhkimson-infor.vercel.app",
    siteName: "Nhanh Kimson Portfolio",
    images: [
      {
        url: "https://nhanhkimson.dev/preview.jpg", // replace with your actual preview image
        width: 1200,
        height: 630,
        alt: "Nhanh Kimson Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "BBbJJxk-bjlI0Yx1OSGvTMdVDHDiO5xm5H3qgcm3QDk",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
