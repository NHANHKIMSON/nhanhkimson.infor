'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';          
import { Loader2 } from 'lucide-react';

// Animation presets ----------------------------------------------------------
const container = {
  hidden: { opacity: 0 },
  show:  {
    opacity: 1,
    transition: { staggerChildren: 0.15, ease: 'easeOut', duration: 0.4 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show:  { opacity: 1, y: 0 },
};

// Component ------------------------------------------------------------------
export default function Loading() {
  return (
    <motion.div
      className="flex flex-col gap-6 p-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Optional spinner */}
      <motion.div variants={item} className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </motion.div>

      {/* Skeleton headline */}
      <motion.div variants={item}>
        <Skeleton className="h-6 w-1/3 rounded-lg" />
      </motion.div>

      {/* Skeleton cards / list */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </motion.div>
    </motion.div>
  );
}