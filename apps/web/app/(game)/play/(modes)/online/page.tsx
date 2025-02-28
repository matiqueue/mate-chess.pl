"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarImage } from "@workspace/ui/components/avatar"
import { useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { ModeToggle } from "@workspace/ui/components/mode-toggle"
import { PanelLeftClose, PanelLeftOpen, Puzzle } from "lucide-react"
import { SidebarProvider, useSidebar } from "@workspace/ui/components/sidebar"
import { LeftSidebar } from "@/components/game/left-sidebar"
import { useTranslation } from "react-i18next"
import { useSearchParams, useRouter } from "next/navigation"
import io from "socket.io-client"

const socket = io("http://localhost:4000")

function Navbar() {
  const { t } = useTranslation()
  const { open, setOpen } = useSidebar()
  const sidebarOffset = 128

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0, x: 0 }}
      animate={{ y: 0, opacity: 1, x: open ? sidebarOffset : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[3rem] left-0 right-0 mx-auto z-20 w-[60%] max-w-3xl flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-950 shadow-md rounded-xl border border-neutral-200 dark:border-neutral-800"
    >
      <Link href="/home" className="text-lg font-bold text-black dark:text-white">
        <div className="flex items-center">
          <Puzzle className="mr-2 w-4 h-4" /> {t("linkLobby.home")}
        </div>
      </Link>
      <div className="flex items-center space-x-2">
        <Button variant="link" size="sm" onClick={() => setOpen(!open)}>
          <span className="h-[1.2rem] w-[1.2rem]">
            {open ? <PanelLeftClose className="h-[1.2rem] w-[1.2rem]" /> : <PanelLeftOpen className="h-[1.2rem] w-[1.2rem]" />}
          </span>
        </Button>
        <ModeToggle />
      </div>
    </motion.nav>
  )
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 5 * position}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function OnlineLobby() {
  const { t } = useTranslation()
  const { isSignedIn, user } = useUser()
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get("lobbyId")

  const [mounted, setMounted] = useState(false)
  const [lobby, setLobby] = useState<Player[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isLargeScreen, setIsLargeScreen] = useState(true)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!lobbyId || !user) return

    socket.emit("joinLobby", lobbyId)
    socket.on("playerJoined", (players) => {
      console.log("[FRONT] Zaktualizowano listę graczy:", players)
      setLobby(players)
    })
    socket.on("countdown", (count) => {
      console.log("[FRONT] Odliczanie:", count)
      setCountdown(count)
    })
    socket.on("gameStarted", (gameUrl) => {
      console.log("[FRONT] Gra rozpoczęta, przekierowanie do:", gameUrl)
      router.push(gameUrl)
    })

    return () => {
      socket.off("playerJoined")
      socket.off("countdown")
      socket.off("gameStarted")
    }
  }, [lobbyId, user, router])

  if (!mounted || !lobbyId || !isSignedIn) return null

  const defaultAvatarUrl = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  const borderColor = theme === "dark" ? "border-white" : "border-neutral-500"
  const buttonClasses = theme === "dark" ? "px-8 py-4 bg-white text-black" : "px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"

  return (
    <SidebarProvider>
      <LeftSidebar />
      <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
        {isLargeScreen && <Navbar />}
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="text-center">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold mb-12 tracking-tighter"
            >
              {t("linkLobby.waitingForSecondPlayer")
                .split(" ")
                .map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={`${wordIndex}-${letterIndex}`}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: wordIndex * 0.1 + letterIndex * 0.03,
                          type: "spring",
                          stiffness: 150,
                          damping: 25,
                        }}
                        className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-white dark:to-white"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
            </motion.h1>

            <div className="flex flex-row justify-center items-center gap-12 mb-12">
              {lobby.map((player, index) => (
                <div key={player.id} className="flex flex-col items-center">
                  <div
                    className={`rounded-full ${theme === "light" ? "p-[2px]" : "p-1"} ${borderColor} border-4 ${
                      index === 1 && lobby.length === 1 ? "animate-pulse" : ""
                    }`}
                  >
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={player.avatar || defaultAvatarUrl} alt={player.name} />
                    </Avatar>
                  </div>
                  <span className="text-2xl font-semibold text-neutral-700 dark:text-white">{player.name}</span>
                </div>
              ))}
              {lobby.length === 1 && (
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`rounded-full ${theme === "light" ? "p-[2px]" : "p-1"} ${borderColor} border-4`}
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={defaultAvatarUrl} alt={t("linkLobby.guest")} />
                    </Avatar>
                  </motion.div>
                  <span className="text-2xl font-semibold text-neutral-700 dark:text-white">{t("linkLobby.waiting")}</span>
                </div>
              )}
            </div>

            {countdown !== null && <p className="mt-2 text-xl text-neutral-700 dark:text-white">{t("linkLobby.startCountdown", { count: countdown })}</p>}
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  )
}

interface Player {
  id: string
  name: string
  avatar: string
  isGuest: boolean
}
