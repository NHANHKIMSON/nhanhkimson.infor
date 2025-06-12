"use client";
import { motion } from '@motionone/react'

export function HeroSectionTextAnimation() {
  return (
    <>
      <section className="py-20 px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hello! I am <span className="text-purple-400">Nhanh Kimson</span>
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          A Software Engineer & Developer
        </motion.h2>

        <motion.p
          className="text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Currently a student at Beltei International University and Korea
          Software HRD Center (13th batch). I specialize in full-stack
          development with experience in Java Spring, PHP Laravel, C#, Python
          Flask, and more.
        </motion.p>
      </section>
    </>
  );
}
