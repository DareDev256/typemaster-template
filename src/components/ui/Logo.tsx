"use client";

import { motion } from "framer-motion";
import { getSiteConfig } from "@/data/curriculum";

export function Logo() {
  const config = getSiteConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="font-pixel text-3xl md:text-5xl lg:text-6xl text-arcade-neon-green neon-glow mb-4">
        {config.siteName.toUpperCase()}
      </h1>
      <motion.p
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-pixel text-base md:text-lg text-arcade-neon-magenta"
      >
        {config.tagline.toUpperCase()}
      </motion.p>
    </motion.div>
  );
}
