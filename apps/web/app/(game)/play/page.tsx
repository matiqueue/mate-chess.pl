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
import { v4 as uuidv4 } from "uuid"

/**
 * Obiekt animacji kontenera.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

/**
 * Obiekt animacji elementu.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/**
 * Animacja unoszenia elementu.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
const floatingAnimation = {
  y: [0, 5, 0],
  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" },
}

/**
 * Motion-enabled Button.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
const MotionButton = motion.create(Button)

/**
 * Motion-enabled Card.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
const MotionCard = motion.create(Card)

/**
 * GameModeSelector
 *
 * Komponent pozwalający wybrać tryb gry, umożliwiający:
 * - stworzenie lobby za pomocą linku,
 * - dołączenie do lobby za pomocą podanego kodu,
 * - dołączenie do lobby online (tylko dla zalogowanych użytkowników).
 *
 * Obsługuje animacje przy użyciu framer-motion oraz tłumaczenia dzięki react-i18next.
 *
 * @returns {JSX.Element} Element JSX reprezentujący selektor trybu gry.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function GameModeSelector() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useUser()
  const { t } = useTranslation()

  const [mounted, setMounted] = useState(false)
  const [showJoinInput, setShowJoinInput] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [showOnlineTooltip, setShowOnlineTooltip] = useState(false)

  // Ustawienie flagi mounted po zamontowaniu komponentu
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Definicja dostępnych trybów gry
  const gameModes = [
    {
      key: "local",
      title: t("gameModeLocal"),
      description: t("gameModeLocalDescription"),
      icon: Users,
    },
    {
      key: "withLink",
      title: t("gameModeWithLink"),
      description: t("gameModeWithLinkDescription"),
      icon: Link2,
    },
    {
      key: "online",
      title: t("gameModeOnline"),
      description: t("gameModeOnlineDescription"),
      icon: Server,
    },
  ]

  /**
   * handleCreateLinkLobby
   *
   * Tworzy nowe lobby typu "link". Pobiera dane gracza z konta użytkownika lub generuje dane gościa,
   * wysyła żądanie POST do API oraz przekierowuje użytkownika do nowo utworzonego lobby.
   */
  const handleCreateLinkLobby = async () => {
    const player = user
      ? { id: user.id, name: user.firstName || "User", avatar: user.imageUrl || "", isGuest: false }
      : { id: localStorage.getItem("guestId") || uuidv4(), name: "Guest", avatar: "/default-avatar.png", isGuest: true }

    if (player.isGuest && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", player.id)
    }

    const res = await fetch("http://localhost:4000/api/create-link-lobby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player }),
    })
    const data = await res.json()
    router.push(`/play/link?code=${data.code}&lobbyId=${data.lobbyId}`)
  }

  /**
   * handleJoinLinkLobby
   *
   * Dołącza użytkownika do istniejącego lobby za pomocą kodu.
   * Wysyła żądanie POST do API i przekierowuje do lobby, jeśli operacja się powiedzie.
   */
  const handleJoinLinkLobby = async () => {
    const player = user
      ? { id: user.id, name: user.firstName || "User", avatar: user.imageUrl || "", isGuest: false }
      : { id: localStorage.getItem("guestId") || uuidv4(), name: "Guest", avatar: "/default-avatar.png", isGuest: true }

    if (player.isGuest && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", player.id)
    }

    const res = await fetch("http://localhost:4000/api/join-link-lobby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, player }),
    })
    const data = await res.json()
    if (data.lobbyId) {
      router.push(`/play/link?code=${joinCode}&lobbyId=${data.lobbyId}`)
    } else {
      alert(data.error)
    }
  }

  /**
   * handleJoinOnlineLobby
   *
   * Dołącza użytkownika do lobby online.
   * Jeśli użytkownik nie jest zalogowany, wyświetla tooltip informujący o konieczności logowania.
   */
  const handleJoinOnlineLobby = async () => {
    if (!user) {
      setShowOnlineTooltip(true)
      return
    }

    const player = { id: user.id, name: user.firstName || "User", avatar: user.imageUrl || "", isGuest: false }

    const res = await fetch("http://localhost:4000/api/join-online-lobby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player }),
    })
    const data = await res.json()
    if (data.lobbyId) {
      router.push(`/play/online?lobbyId=${data.lobbyId}`)
    } else {
      alert(data.error)
    }
  }

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
          className="relative z-10 text-foreground flex flex-col items-center justify-start p-4 pt-[15vh] overflow-hidden flex-grow"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                      onClick={
                        mode.key === "withLink"
                          ? handleCreateLinkLobby
                          : mode.key === "online"
                            ? handleJoinOnlineLobby
                            : () => router.push(`/play/${mode.key.toLowerCase()}`)
                      }
                      disabled={isOnline && !user}
                    >
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                        {t("startGame", { mode: mode.title })}
                      </motion.span>
                      <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 w-full max-w-4xl flex flex-col items-center gap-4">
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
                  onChange={(e) => setJoinCode(e.target.value.slice(0, 6).toUpperCase())}
                  placeholder={t("enterCodePlaceholder")}
                  className="flex-1 p-2 border border-gray-300 rounded shadow-lg text-center bg-background text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
                <MotionButton
                  className="flex-1 bg-popover-foreground hover:bg-primary border"
                  onClick={handleJoinLinkLobby}
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
