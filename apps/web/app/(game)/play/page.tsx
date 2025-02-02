"use client"
import { motion } from "framer-motion"
import { Link2, Server, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const floatingAnimation = {
  y: [0, 5, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  },
}

const MotionButton = motion(Button)
const MotionCard = motion(Card)

export default function GameModeSelector() {
  return (
    <motion.div
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sidebar text-foreground flex flex-col items-center justify-start p-4 pt-[15vh] relative overflow-hidden flex-grow"
    >
      {/* Animowane elementy w tle */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-[hsla(var(--secondary),0.2)] rounded-full filter blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[hsla(var(--primary),0.2)] rounded-full filter blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
      >
        Select Game Mode
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gray-400 text-lg md:text-xl mb-12"
      >
        Choose your preferred mode to start the game.
      </motion.p>

      <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {[
          {
            title: "Client",
            description: "Play with a friend via a shared link.",
            icon: Link2,
            action: "Play as Client",
          },
          {
            title: "Server",
            description: "Automatic matchmaking with random players.",
            icon: Server,
            action: "Play on Server",
          },
        ].map((mode) => (
          <MotionCard
            key={mode.title}
            variants={item}
            whileHover={{ scale: 1.05 }}
            className="bg-card/50 border border-border transition-transform duration-300"
          >
            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full">
              <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                <mode.icon className="w-8 h-8" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold"
              >
                {mode.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-muted-foreground text-center mb-4 text-base md:text-lg"
              >
                {mode.description}
              </motion.p>

              <MotionButton
                className="mt-auto bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                  {mode.action}
                </motion.span>
                <motion.div
                  className="ml-2"
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </MotionButton>
            </CardContent>
          </MotionCard>
        ))}
      </motion.div>
    </motion.div>
  )
}
