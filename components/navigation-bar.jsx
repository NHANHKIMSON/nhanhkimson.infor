"use client";

import Link from "next/link";
import { DownloadCv } from "@/components/download-cv";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NavigationBar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = [
      "home",
      "about",
      "skills",
      "projects",
      "certificates",
      "contact",
    ];

    const handleScroll = () => {
      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 100 && bottom >= 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "/certificates", label: "Certificates" }, // actual route
    { href: "#contact", label: "Contact" },
  ];

  const LinkOrAnchor = ({ href, children, className, onClick }) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className} onClick={onClick}>
          {children}
        </Link>
      );
    }
    return (
      <motion.a
        href={href}
        className={className}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.a>
    );
  };

  return (
    <nav className="mx-auto py-4 sm:py-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-purple-950/70 px-4 sm:px-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        NK
      </motion.div>

      {/* Desktop nav */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
        className="hidden md:flex gap-6"
      >
        {navLinks.map((link) => (
          <LinkOrAnchor
            key={link.href}
            href={link.href}
            className={`hover:text-purple-400 transition-colors ${
              activeSection === link.href.replace(/^#/, "")
                ? "text-purple-400 font-bold"
                : ""
            }`}
          >
            {link.label}
          </LinkOrAnchor>
        ))}
      </motion.div>

      {/* Hamburger */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="md:hidden text-white"
        onClick={() => {
          const mobileMenu = document.getElementById("mobile-menu");
          mobileMenu?.classList.toggle("hidden");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </motion.button>

      {/* Mobile menu */}
      <motion.div
        id="mobile-menu"
        className="hidden absolute top-full left-0 right-0 bg-purple-950/95 backdrop-blur-md p-4 flex flex-col gap-4 border-b border-purple-800/50 md:hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {navLinks.map((link) => (
          <LinkOrAnchor
            key={`mobile-${link.href}`}
            href={link.href}
            className={`hover:text-purple-400 transition-colors ${
              activeSection === link.href.replace(/^#/, "")
                ? "text-purple-400 font-bold"
                : ""
            }`}
            onClick={() =>
              document.getElementById("mobile-menu")?.classList.add("hidden")
            }
          >
            {link.label}
          </LinkOrAnchor>
        ))}
      </motion.div>

      <DownloadCv />
    </nav>
  );
}