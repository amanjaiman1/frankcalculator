'use client';

import { motion } from 'framer-motion';

/**
 * Next.js re-mounts `template.tsx` on every navigation, so this gives each
 * newly-loaded page a subtle ease-in (fade + slight rise) that plays as the
 * route-transition curtain lifts away — and a gentle fade on back/forward too.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
