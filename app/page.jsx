"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Github, Youtube, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { HeroSectionTextAnimation } from "@/components/hero-text-animation";
import { NavigationBar } from "../components/navigation-bar.jsx";

const metadata = {
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
    "Portfolio",
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
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData); // Show all projects
        }

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          setSkills(skillsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSubmitMessage(
          "Thank you for your message! I'll get back to you soon."
        );
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitMessage(
          "Sorry, there was an error sending your message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage(
        "Sorry, there was an error sending your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Navigation */}
      <NavigationBar />

      <main className="min-h-screen px-4 bg-gradient-to-b from-purple-950 to-black text-white">
        {/* Hero Section */}
        <section
          id="home"
          className="container mx-auto py-20 flex flex-col md:flex-row items-center gap-10"
        >
          <motion.div
            className="md:w-1/2 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="relative w-full max-w-[400px] mx-auto">
              <div className="absolute -inset-3 rounded-full bg-purple-500 blur-xl opacity-30 animate-pulse z-0" />
              <div className="relative z-10">
                <Image
                  src={"son.jpg" || "/placeholder.svg?height=400&width=400"}
                  alt="Nhanh Kimson"
                  width={400}
                  height={400}
                  className="rounded-full border-4 border-purple-500 w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <HeroSectionTextAnimation />
            <div className="flex gap-4">
              <Button
                className="bg-purple-600 hover:bg-purple-700 rounded-2xl"
                size="lg"
              >
                <a href="#contact" className="flex items-center gap-2">
                  Contact Me <Mail size={16} />
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-900/20 rounded-2xl"
                size="lg"
              >
                <a href="#projects" className="flex items-center gap-2">
                  View Projects <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto py-20">
          <motion.h2
            className="text-3xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="bg-purple-950/30 p-8 rounded-2xl border border-purple-800/50 backdrop-blur-sm shadow-lg shadow-purple-900/20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Tabs defaultValue="background" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-purple-900/50 rounded-xl mb-6">
                <TabsTrigger
                  value="background"
                  className="data-[state=active]:bg-purple-700 rounded-xl"
                >
                  Background
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-purple-700 rounded-xl"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="interests"
                  className="data-[state=active]:bg-purple-700 rounded-xl"
                >
                  Interests
                </TabsTrigger>
              </TabsList>
              <TabsContent value="background" className="space-y-4">
                <p className="text-lg">
                  I'm a passionate software engineer and developer with a strong
                  foundation in multiple programming languages and frameworks.
                  My journey in programming started with a curiosity about how
                  applications work, and it has evolved into a deep passion for
                  creating efficient, user-friendly software solutions.
                </p>
                <p className="text-lg">
                  I enjoy tackling complex problems and turning ideas into
                  functional applications. My goal is to create software that
                  makes a positive impact on people's lives.
                </p>
              </TabsContent>
              <TabsContent value="education" className="space-y-4">
                <p className="text-lg">
                  <strong>Beltei International University</strong>
                  <br />
                  Currently in Year II, Semester II
                  <br />
                  Computer Science Major
                </p>
                <p className="text-lg">
                  <strong>Korea Software HRD Center</strong>
                  <br />
                  13th Batch
                  <br />
                  Specialized training in software development
                </p>
              </TabsContent>
              <TabsContent value="interests" className="space-y-4">
                <p className="text-lg">
                  When I'm not coding, I create programming tutorials on my
                  YouTube channel to help others learn and grow in the field of
                  software development. I'm passionate about sharing knowledge
                  and contributing to the developer community.
                </p>
                <p className="text-lg">
                  I also enjoy exploring new technologies, participating in
                  hackathons, and collaborating on open-source projects.
                </p>
              </TabsContent>
            </Tabs>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="container mx-auto py-20">
          <motion.h2
            className="text-3xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Tech Stack
          </motion.h2>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-purple-900/50 rounded-2xl p-4 text-center animate-pulse"
                >
                  <div className="h-6 bg-purple-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className={`${skill.color} rounded-2xl p-4 text-center hover:scale-105 transition-transform shadow-lg`}
                  variants={itemVariant}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)",
                  }}
                >
                  <span className="font-semibold">{skill.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Projects Section */}
        <section id="projects" className="container mx-auto py-20">
          <motion.h2
            className="text-3xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-purple-950/30 border-purple-800/50 rounded-2xl animate-pulse"
                >
                  <div className="h-48 bg-purple-900/50 rounded-t-2xl"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-purple-700 rounded mb-2"></div>
                    <div className="h-4 bg-purple-700 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-purple-700 rounded"></div>
                      <div className="h-6 w-20 bg-purple-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects.map((project, index) => (
                <motion.div key={project.id} variants={itemVariant}>
                  <Card className="bg-purple-950/30 border-purple-800/50 overflow-hidden hover:shadow-purple-500/20 hover:shadow-lg transition-all rounded-2xl">
                    <div className="h-48 bg-gradient-to-r from-purple-900 to-indigo-900 relative">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-semibold">
                            Project Screenshot
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            className="bg-purple-700 rounded-xl"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-600 text-purple-400 hover:bg-purple-900/20 rounded-xl"
                            asChild
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="mr-2 h-4 w-4" /> View Code
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                            asChild
                          >
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" /> Live
                              Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Social Links */}
        <section className="container mx-auto py-20">
          <motion.h2
            className="text-3xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Find Me Online
          </motion.h2>
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.a
              href="https://github.com/NHANHKIMSON"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl transition-colors"
              variants={itemVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={24} />
              <span>GitHub</span>
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@sonprogramming"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 p-4 rounded-2xl transition-colors"
              variants={itemVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube size={24} />
              <span>YouTube</span>
            </motion.a>
            <motion.a
              href="mailto:contact@example.com"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 p-4 rounded-2xl transition-colors"
              variants={itemVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={24} />
              <span>Email</span>
            </motion.a>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto py-20">
          <motion.h2
            className="text-3xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Contact Me
          </motion.h2>
          <motion.div
            className="max-w-2xl mx-auto bg-purple-950/30 p-8 rounded-2xl border border-purple-800/50 backdrop-blur-sm shadow-lg shadow-purple-900/20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <form onSubmit={handleContactSubmit} className="space-y-6">
              {submitMessage && (
                <div
                  className={`p-3 rounded-xl text-sm ${
                    submitMessage.includes("Thank you")
                      ? "bg-green-500/20 border border-green-500 text-green-200"
                      : "bg-red-500/20 border border-red-500 text-red-200"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-purple-900/50 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-purple-900/50 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-purple-900/50 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={contactForm.message}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-purple-900/50 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-purple-950/50 py-10 border-t border-purple-800/30">
          <div className="container mx-auto text-center">
            <p className="mb-4">
              © {new Date().getFullYear()} Nhanh Kimson. All rights reserved.
            </p>
            <motion.div
              className="flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.a
                href="https://github.com/NHANHKIMSON"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-6 w-6 hover:text-purple-400 transition-colors" />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@sonprogramming"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube className="h-6 w-6 hover:text-purple-400 transition-colors" />
              </motion.a>
              <motion.a
                href="mailto:contact@example.com"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="h-6 w-6 hover:text-purple-400 transition-colors" />
              </motion.a>
            </motion.div>
          </div>
        </footer>
      </main>
    </>
  );
}
