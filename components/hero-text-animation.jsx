'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function HeroSectionTextAnimation() {
    const [professionIndex, setProfessionIndex] = useState(0);
    const professions = [
        'Software Engineer',
        'Full-Stack Developer',
        'Java Specialist',
        'Python Developer',
        'Laravel Expert',
        'C# Programmer'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProfessionIndex((prev) => (prev + 1) % professions.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Hello! I am <span className="text-purple-400">Nhanh Kimson</span>
                </motion.h1>

                <motion.div
                    className="text-2xl md:text-3xl mb-6 min-h-[2.5rem]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <motion.div
                        key={professionIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute"
                    >
                        A {professions[professionIndex]}
                    </motion.div>
                </motion.div>

                <motion.p
                    className="text-gray-300 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    Currently a student at Beltei International University and Korea
                    Software HRD Center (13th batch). I specialize in full-stack
                    development with experience in Java Spring, PHP Laravel, C#, Python
                    Flask, and more.
                </motion.p>
            </motion.div>
        </div>
    );
}