'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Animation presets
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      ease: 'easeOut',
      duration: 0.4
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const itemVariant = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

export default function Loading() {
  return (
      <div className="w-full p-6">
        {/* Tab Bar Skeleton */}
        <div className="grid grid-cols-5 mb-8 gap-2">
          {[...Array(5)].map((_, i) => (
              <Skeleton
                  key={i}
                  className="h-10 bg-purple-900/50 rounded-xl"
              />
          ))}
        </div>

        {/* Stats Grid Skeleton */}
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[...Array(3)].map((_, i) => (
              <motion.div key={i} variants={itemVariant}>
                <Skeleton className="h-32 bg-purple-950/30 border border-purple-800/50 rounded-2xl" />
              </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Skeleton */}
        <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
        >
          <div className="bg-purple-950/30 border border-purple-800/50 rounded-2xl p-6">
            <div className="mb-6">
              <Skeleton className="h-6 w-1/4 mb-2 bg-purple-700/50" />
              <Skeleton className="h-4 w-1/3 bg-purple-700/50" />
            </div>

            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-purple-900/20 rounded-xl">
                    <Skeleton className="h-5 w-5 rounded-full bg-purple-400/30" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2 bg-purple-700/50" />
                      <Skeleton className="h-3 w-1/2 bg-purple-700/50" />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
  );
}