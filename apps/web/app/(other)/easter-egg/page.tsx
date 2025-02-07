"use client"

import { motion } from "framer-motion"
import { Egg } from "lucide-react"

export default function EasterEggPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-4 p-6 rounded-lg shadow-lg
                   bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] font-sans"
      >
        <Egg size={64} className="text-[hsl(var(--primary))]" />
        <h1 className="text-4xl font-bold">U found an Easter Egg!</h1>
      </motion.div>
    </div>
  )
}
