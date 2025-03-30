"use client"
/* eslint-disable @next/next/no-server-import-in-page */


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
import { useSearchParams, useRouter } from "next/navigation"
import io from "socket.io-client"
import { useTranslation } from "react-i18next"

// Inicjalizacja połączenia WebSocket z serwerem
const socket = io("http://localhost:4000")

/**
 * Navbar
 *
 * Komponent nawigacji wyświetlany w lobby. Umożliwia kopiowanie kodu lobby,
 * przełączanie widoczności sidebaru oraz zmianę motywu.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {string} props.code - Kod lobby, który ma być wyświetlony i kopiowany.
 * @returns {JSX.Element} Element JSX reprezentujący nawigację.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * Source: Własna implementacja
 */
function Navbar({ code }: { code: string }) {
  const { open, setOpen } = useSidebar()
  const { t } = useTranslation()
  const sidebarOffset = 128

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0, x: 0 }}
      animate={{ y: 0, opacity: 1, x: open ? sidebarOffset : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[3rem] left-0 right-0 mx-auto z-20 w-[60%] max-w-3xl flex items-center px-6 py-4 bg-white dark:bg-neutral-950 shadow-md rounded-xl border border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex-1">
        <Link href="/home" className="text-lg font-bold text-black dark:text-white">
          <div className="flex items-center">
            <Puzzle className="mr-2 w-4 h-4" /> {t("linkLobby.home")}
          </div>
        </Link>
      </div>

      <div className="flex-1 text-center relative group">
        <div className="inline-block border-l-[3px] border-r-[3px] border-black dark:border-white rounded-md px-5 cursor-pointer" onClick={handleCopyCode}>
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1, 1, 1.1, 1.0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-lg font-bold text-black dark:text-white inline-block"
          >
            {t("linkLobby.linkLabel", { code })}
          </motion.span>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-800 text-white text-sm py-1 px-2 rounded">
          {t("linkLobby.copyTooltip")}
        </div>
      </div>

      <div className="flex-1 flex justify-end items-center space-x-2">
        <Button variant="link" size="icon" onClick={() => setOpen(!open)}>
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <ModeToggle />
      </div>
    </motion.nav>
  )
}

/**
 * FloatingPaths
 *
 * Komponent renderujący animowane ścieżki SVG w tle, tworzący dynamiczny efekt graficzny.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {number} props.position - Pozycja, wpływająca na krzywiznę ścieżek.
 * @returns {JSX.Element} Element JSX zawierający animowane ścieżki SVG.
 *
 * @remarks
 * Autor: nasakrator
 */
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

/**
 * LinkLobby
 *
 * Główny komponent strony lobby dla gry poprzez link.
 * Umożliwia dołączanie do lobby, wyświetla listę graczy, animacje odliczania,
 * obsługuje akcje takie jak start gry czy wyrzucenie gracza.
 *
 * @returns {JSX.Element | null} Element JSX reprezentujący stronę lobby lub null, gdy wymagane dane nie są dostępne.
 *
 * @remarks
 * Autor: nasakrator
 */
export default function LinkLobby() {
  const { isSignedIn, user } = useUser()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
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
    if (!lobbyId) return

    socket.emit("joinLobby", lobbyId)
    socket.on("playerJoined", (players: Player[]) => {
      console.log("[FRONT] Zaktualizowano listę graczy:", players)
      setLobby(players)
    })
    socket.on("playerKicked", (playerId: string) => {
      const myId = user?.id || localStorage.getItem("guestId")
      if (playerId === myId) {
        alert(t("linkLobby.kickedFromLobby"))
        router.push("/play")
      }
    })
    socket.on("countdown", (count: number) => {
      console.log("[FRONT] Odliczanie:", count)
      setCountdown(count)
    })
    socket.on("gameStarted", (gameUrl: string) => {
      console.log("[FRONT] Gra rozpoczęta, przekierowanie do:", gameUrl)
      router.push(gameUrl)
    })

    return () => {
      socket.off("playerJoined")
      socket.off("playerKicked")
      socket.off("countdown")
      socket.off("gameStarted")
    }
  }, [lobbyId, user, router, t])

  const handleStartGame = async () => {
    const myId = user?.id || localStorage.getItem("guestId")
    const res = await fetch("http://localhost:4000/api/start-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lobbyId, creatorId: myId }),
    })
    const data = await res.json()
    if (!data.success) alert(data.error)
  }

  const handleKickPlayer = async (playerId: string) => {
    const myId = user?.id || localStorage.getItem("guestId")
    const res = await fetch("http://localhost:4000/api/kick-player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lobbyId, playerId, creatorId: myId }),
    })
    const data = await res.json()
    if (!data.success) alert(data.error)
  }

  if (!mounted || !code || !lobbyId) return null

  const defaultAvatarUrl = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  const myId = user?.id || localStorage.getItem("guestId")
  const isCreator = myId === lobby[0]?.id
  const borderColor = theme === "dark" ? "border-white" : "border-neutral-500"
  const buttonClasses = theme === "dark" ? "px-8 py-4 bg-white text-black" : "px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"

  return (
    <SidebarProvider>
      <LeftSidebar />
      <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
        {isLargeScreen && <Navbar code={code} />}
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="text-center">
            <motion.h1
              style={{ height: "calc(100% + 10px)" }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold mb-12 tracking-tighter"
            >
              {lobby.length < 2
                ? t("linkLobby.waitingForSecondPlayer")
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
                    ))
                : t("linkLobby.bothPlayersInLobby")
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
                      <AvatarImage src={defaultAvatarUrl} alt="Guest" />
                    </Avatar>
                  </motion.div>
                  <span className="text-2xl font-semibold text-neutral-700 dark:text-white">{t("linkLobby.waiting")}</span>
                </div>
              )}
            </div>

            {lobby.length === 2 && isCreator && (
              <div className="flex justify-center gap-4">
                <Button onClick={handleStartGame} className={buttonClasses}>
                  {t("linkLobby.acceptGame")}
                </Button>
                {lobby[1] && (
                  <Button onClick={() => handleKickPlayer(lobby[1]!.id)} className="px-8 py-4 bg-red-500 text-white">
                    {t("linkLobby.kickPlayer")}
                  </Button>
                )}
              </div>
            )}
            {countdown !== null && <p className="mt-2 text-xl text-neutral-700 dark:text-white">{t("linkLobby.countdown", { count: countdown })}</p>}
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  )
}

/**
 * Interfejs Player
 *
 * Definiuje strukturę obiektu reprezentującego gracza.
 *
 * @property {string} id - Unikalny identyfikator gracza.
 * @property {string} name - Nazwa gracza.
 * @property {string} avatar - URL awatara gracza.
 * @property {boolean} isGuest - Określa, czy gracz jest gościem.
 *
 * @remarks
 * Autor: nasakrator
 */
interface Player {
  id: string
  name: string
  avatar: string
  isGuest: boolean
}
