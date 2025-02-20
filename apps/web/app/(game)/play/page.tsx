"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link2, Server, ArrowRight, Users } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useUser } from "@clerk/nextjs"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useTranslation } from "react-i18next"

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
  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" },
}
const MotionButton = motion.create(Button)
const MotionCard = motion.create(Card)

export default function GameModeSelector() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useUser()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [showJoinInput, setShowJoinInput] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [showOnlineTooltip, setShowOnlineTooltip] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const gameModes = [
    {
      key: "local",
      title: t("gameModeLocal"), // np. "Local"
      description: t("gameModeLocalDescription"), // np. "Play with a friend on the same computer."
      icon: Users,
    },
    {
      key: "withLink",
      title: t("gameModeWithLink"), // np. "With Link"
      description: t("gameModeWithLinkDescription"), // np. "Create a lobby and share the link with your friend."
      icon: Link2,
    },
    {
      key: "online",
      title: t("gameModeOnline"), // np. "Online"
      description: t("gameModeOnlineDescription"), // np. "Play against a random opponent online."
      icon: Server,
    },
  ]

  const handleModeSelect = (mode: string) => {
    // Jeśli tryb Online i brak użytkownika – nie rób nic
    if (mode === "Online" && !user) return
    const route = mode === "With Link" ? "/play/link" : `/play/${mode.toLowerCase()}`
    router.push(route)
  }

  const handleJoinLobby = () => {
    console.log("Joining lobby with code:", joinCode)
  }

  return (
    <ScrollArea>
      <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
        {/* Background Image: widoczne tylko w trybie ciemnym */}
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

        {/* Content */}
        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-foreground flex flex-col items-center justify-start p-4 pt-[15vh] overflow-hidden flex-grow"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 py-10"
          >
            {t("selectGameMode")}
          </motion.h1>

          <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            {gameModes.map((mode) => {
              const isOnline = mode.key === "online"
              return (
                <MotionCard
                  key={mode.key}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 border border-border transition-transform duration-300"
                  onMouseEnter={isOnline && !user ? () => setShowOnlineTooltip(true) : undefined}
                  onMouseLeave={isOnline && !user ? () => setShowOnlineTooltip(false) : undefined}
                >
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full relative">
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
                      className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModeSelect(mode.key)}
                      disabled={isOnline && !user}
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {t("startGame", { mode: mode.title })}
                      </motion.span>
                      <motion.div
                        className="ml-2"
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </MotionButton>

                    {isOnline && !user && showOnlineTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary-foreground text-foreground rounded py-2 px-3 shadow-lg"
                      >
                        {t("mustBeLoggedInToPlayOnline")}
                      </motion.div>
                    )}
                  </CardContent>
                </MotionCard>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-4xl flex flex-col items-center gap-4"
          >
            <MotionButton
              className="w-1/2 bg-popover-foreground hover:bg-primary border"
              onClick={() => setShowJoinInput((prev) => !prev)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {t("joinGameViaCode")}
            </MotionButton>
            {showJoinInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-row items-center gap-4 mt-4 w-1/2"
              >
                <motion.input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.slice(0, 5))}
                  placeholder={t("enterCodePlaceholder")}
                  className="flex-1 p-2 border border-gray-300 rounded shadow-lg text-center bg-background text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
                <MotionButton
                  className="flex-1 bg-popover-foreground hover:bg-primary border"
                  onClick={handleJoinLobby}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {t("joinLobby")}
                </MotionButton>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </ScrollArea>
  )
}
