"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Crown, ArrowRight, User } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useUser } from "@clerk/nextjs"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useTranslation } from "react-i18next"

/**
 * Obiekt animacji kontenera.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

/**
 * Obiekt animacji pojedynczego elementu.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/**
 * Animacja unoszenia elementu.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
const floatingAnimation = {
  y: [0, 5, 0],
  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" },
}

const MotionButton = motion.create(Button)
const MotionCard = motion.create(Card)

/**
 * GameModeSelector
 *
 * Komponent umożliwiający wybór trybu gry (dla gry z botem) z animacjami przy użyciu framer-motion.
 * Każdy tryb zawiera tytuł, opis, przycisk oraz ikonę reprezentującą dany tryb.
 *
 * @returns {JSX.Element} Element JSX reprezentujący selektor trybu gry.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
export default function GameModeSelector() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useUser()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Definicja trybów gry
  const gameModes = [
    {
      key: "beginner",
      title: t("playVsBot2.beginnerBot.title"),
      description: t("playVsBot2.beginnerBot.description"),
      buttonText: t("playVsBot2.beginnerBot.buttonText"),
      icon: User,
    },
    {
      key: "advance",
      title: t("playVsBot2.advancedBot.title"),
      description: t("playVsBot2.advancedBot.description"),
      buttonText: t("playVsBot2.advancedBot.buttonText"),
      icon: Star,
    },
    {
      key: "chessNaster",
      title: t("playVsBot2.chessGrandmaster.title"),
      description: t("playVsBot2.chessGrandmaster.description"),
      buttonText: t("playVsBot2.chessGrandmaster.buttonText"),
      icon: Crown,
    },
  ]

  return (
    <ScrollArea>
      <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
        {theme === "dark" && (
          <motion.div
            className="absolute inset-0 sm:m-[5%] rounded-[70%_10%_90%_15%_/25%_60%_35%_50%]"
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
          className="relative z-10 text-foreground flex flex-col items-center justify-start pt-[8vh] overflow-hidden flex-grow mx-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 py-10"
          >
            {t("selectGameMode")}
          </motion.h1>

          <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
            {gameModes.map((mode) => {
              const isOnline = mode.key === "online" // (Nie jest używane, ale pozostawione dla spójności)
              return (
                <MotionCard
                  key={mode.key}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 border border-border transition-transform duration-300"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full relative">
                    <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                      <mode.icon className="w-8 h-8" />
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-2xl md:text-3xl font-semibold text-center"
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
                      className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={
                        mode.key === "beginner"
                          ? () => router.push(`/bot/${mode.key.toLowerCase()}`)
                          : mode.key === "advance"
                            ? () => router.push(`/bot/${mode.key.toLowerCase()}`)
                            : () => router.push(`/play/${mode.key.toLowerCase()}`)
                      }
                      disabled={isOnline && !user}
                    >
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                        {mode.buttonText}
                      </motion.span>
                      <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </MotionButton>
                  </CardContent>
                </MotionCard>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </ScrollArea>
  )
}
