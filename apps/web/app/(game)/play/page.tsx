"use client"

/* eslint-disable @next/next/no-server-import-in-page */

export const dynamic = "force-dynamic";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@workspace/ui/components/dialog" // Import komponentów dialogu z ShadCN
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import {Circle as ChessPawn} from "lucide-react";

/** Animacja kontenera */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

/** Animacja elementu */
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/** Animacja unoszenia elementu */
const floatingAnimation = {
  y: [0, 5, 0],
  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as "reverse", ease: "easeInOut" },
}

const MotionButton = motion.create(Button)
const MotionCard = motion.create(Card)

export default function GameModeSelector() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useUser()
  const { t } = useTranslation()

  const [mounted, setMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Stan do kontrolowania dialogu
  const [showJoinInput, setShowJoinInput] = useState(false) // Stan do pokazywania inputu w dialogu
  const [joinCode, setJoinCode] = useState("")
  const [showOnlineTooltip, setShowOnlineTooltip] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [botDifficulty, setBotDifficulty] = useState("")
  const [selectedColor, setSelectedColor] = useState("white")
  const [selectedGameType, setSelectedGameType] = useState("")
  const [selectedTimer, setSelectedTimer] = useState(300)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const gameModes = [
    { key: "local", title: t("gameModeLocal"), description: t("gameModeLocalDescription"), icon: Users },
    { key: "withLink", title: t("gameModeWithLink"), description: t("gameModeWithLinkDescription"), icon: Link2 },
    { key: "online", title: t("gameModeOnline"), description: t("gameModeOnlineDescription"), icon: Server },
  ]

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

  const handleGoButtonClick = () => {
    router.push(`/play/local?selectedColor=${selectedColor}&gameType=${selectedTimer}`)
    setIsColorDialogOpen(false)
  }

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
          className="relative z-10 text-foreground flex flex-col items-center justify-start p-4 pt-[10vh] overflow-hidden flex-grow"
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
              if (mode.key === "withLink") {
                return (
                  <Dialog key={mode.key} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <MotionCard
                        variants={item}
                        whileHover={{ scale: 1.05 }}
                        className="bg-card/50 border border-border transition-transform duration-300 cursor-pointer"
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
                          >
                            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                              {t("startLinkGame")}
                            </motion.span>
                            <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </MotionButton>
                        </CardContent>
                      </MotionCard>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-opacity-90 bg-background">
                      <DialogHeader>
                        <DialogTitle>
                          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                            {t("selectAction")}
                          </motion.div>
                        </DialogTitle>
                      </DialogHeader>
                      <motion.div
                        className="flex flex-col gap-4 p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="flex flex-row gap-3 md:gap-4 justify-center">
                          <MotionButton
                            onClick={() => {
                              setIsDialogOpen(false)
                              handleCreateLinkLobby()
                            }}
                            className="flex-1 bg-popover-foreground border border-[hsla(var(--foreground),0.1)] rounded-lg shadow-sm"
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                          >
                            {t("createLobby")}
                          </MotionButton>
                          <MotionButton
                            onClick={() => setShowJoinInput((prev) => !prev)} // Przełączanie widoczności inputu
                            className="flex-1 bg-popover-foreground border border-[hsla(var(--foreground),0.1)] rounded-lg shadow-sm"
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                          >
                            {showJoinInput ? t("hide_code_input") : t("join_with_code")}
                          </MotionButton>
                        </div>
                        {showJoinInput && (
                          <motion.div
                            className="mt-4 flex flex-col gap-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <motion.input
                              type="text"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.slice(0, 6).toUpperCase())}
                              placeholder={t("enterLobbyCode")}
                              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            />
                            <MotionButton
                              onClick={() => {
                                setIsDialogOpen(false)
                                handleJoinLinkLobby()
                              }}
                              className="w-full bg-popover-foreground border border-[hsla(var(--foreground),0.1)] rounded-lg shadow-sm"
                              whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
                              whileTap={{ scale: 0.97 }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              {t("joinLobby2")}
                            </MotionButton>
                          </motion.div>
                        )}
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                )
              }
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
                        mode.key === "online" ? handleJoinOnlineLobby : mode.key === "local" ? () => setIsColorDialogOpen(true) : () => router.push(`/play/${mode.key.toLowerCase()}`)
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
        </motion.div>
      </div>

      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-opacity-90 bg-background">
          <div className="flex flex-col space-y-4">     
            
          <DialogHeader>
              <DialogTitle>{t("selectColorTitle")}</DialogTitle>
              <DialogDescription>{t("selectColorDesc")}</DialogDescription>
            </DialogHeader>
            <RadioGroup
              value={selectedColor} // Upewniamy się, że wartość jest poprawnie ustawiona
              onValueChange={(value) => {
                setSelectedColor(value);
              }}
              className="flex gap-4 justify-center"
            >
              {/* Biały pionek */}
              <label htmlFor="white" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedColor === "white" ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="white" id="white" className="sr-only" />
                  <ChessPawn className="h-16 w-16 text-white fill-white" />
                </div>
              </label>

              {/* Czarny pionek */}
              <label htmlFor="black" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedColor === "black" ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="black" id="black" className="sr-only" />
                  <ChessPawn className="h-16 w-16 text-black fill-black" />
                </div>
              </label>
            </RadioGroup>
            { /* Game type */}    
            <DialogHeader>
              <DialogTitle>{t("selectGameType")}</DialogTitle>
              <DialogDescription>{t("selectGameTypeDesc")}</DialogDescription>
            </DialogHeader>

            <RadioGroup
              value={selectedTimer.toString()} // Upewniamy się, że wartość jest poprawnie ustawiona
              onValueChange={(value) => {
                setSelectedTimer(parseInt(value));
              }}
              className="flex gap-4 justify-center"
            >
              <label htmlFor="time900" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedTimer === 900 ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="900" id="time900" className="sr-only" />
                  <p>Classic</p>
                </div>
              </label>

              <label htmlFor="time300" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedTimer === 300 ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="300" id="time300" className="sr-only" />
                  <p>Rapid</p>
                </div>
              </label>

              <label htmlFor="time120" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedTimer === 120 ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="120" id="time120" className="sr-only" />
                    <p>Blitz</p>
                </div>
              </label>
            </RadioGroup>

            <Button onClick={handleGoButtonClick}>{t("goNext")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}

