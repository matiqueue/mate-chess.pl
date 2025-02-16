"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Brain, Trophy, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const floatingAnimation = {
  y: [0, 5, 0],
  transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const, ease: "easeInOut" },
}

const MotionButton = motion(Button)
const MotionCard = motion(Card)

export default function PlayVsBotPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleModeSelect = (mode: string) => {
    console.log(`Selected mode: ${mode}`)
    const route =
    mode === "Chess Grandmaster"
      ? "/bot/chess-master"
      : `/bot/ai/${mode.replace(" Bot", "").toLowerCase()}`;

  router.push(route);
  }

  const botOptions = [
    {
      title: "Beginner Bot",
      description:
        "Perfect for newcomers. This bot plays simple moves, allowing you to learn the basics of chess strategy.",
      icon: Bot,
    },
    {
      title: "Advanced Bot",
      description: "Challenging for intermediate players. This bot employs more complex strategies and tactics.",
      icon: Brain,
    },
  ]

  const masterOption = {
    title: "Chess Grandmaster",
    description:
      "Test your skills against a simulated Grandmaster. Prepare for high-level chess strategies and deep positional play.",
    icon: Trophy,
  }

  return (
    <ScrollArea>
      <div className="relative w-full" style={{ minHeight: "calc(100vh - 64px)" }}>
        {theme === "dark" && (
          <motion.div
            className="absolute inset-0 sm:m-[5%] rounded-[50%_35%_60%_25%_/15%_90%_10%_70%]"
            style={{
              backgroundImage: "url('/backgrounds/playBgImage.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.1,
            }}
          />
        )}

        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-foreground flex flex-col items-center justify-start p-4 pt-[10vh] overflow-hidden flex-grow"
        >
        <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 "
        >
        Play vs Bot
        </motion.h1>


          {/* AI Bots Section */}
          <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">AI Bots</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {botOptions.map((bot) => (
                <MotionCard
                  key={bot.title}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 border border-border transition-transform duration-300"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full">
                    <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                      <bot.icon className="w-8 h-8" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-xl md:text-2xl font-semibold"
                    >
                      {bot.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-muted-foreground text-center mb-4 text-sm md:text-base"
                    >
                      {bot.description}
                    </motion.p>
                    <MotionButton
                      className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModeSelect(bot.title)}
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        Play {bot.title}
                      </motion.span>
                      <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </MotionButton>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </motion.div>

          {/* Chess Master Section */}
          <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Chess Master</h2>
            <MotionCard
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-card/50 border border-border transition-transform duration-300"
            >
              <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full">
                <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                  <masterOption.icon className="w-12 h-12" /> {/* Larger icon for emphasis */}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl md:text-3xl font-semibold" // Larger text for emphasis
                >
                  {masterOption.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-muted-foreground text-center mb-4 text-base md:text-lg" // Larger text for emphasis
                >
                  {masterOption.description}
                </motion.p>
                <MotionButton
                  className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleModeSelect(masterOption.title)}
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Challenge the Grandmaster
                  </motion.span>
                  <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </MotionButton>
              </CardContent>
            </MotionCard>
          </motion.div>
        </motion.div>
      </div>
    </ScrollArea>
  )
}
