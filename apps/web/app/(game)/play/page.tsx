"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { io } from "socket.io-client"
import { Link2, Server, ArrowRight, Users } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation" // opcjonalnie, do nawigacji

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
  const [showJoinInput, setShowJoinInput] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const router = useRouter() // jeśli chcesz przekierować użytkownika

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure the code is at most 5 characters
    const code = e.target.value.slice(0, 5)
    setJoinCode(code)
  }

  // Handler dla trybu Local
  const handleStartLocalGame = () => {
    console.log("Starting local game...")
    // Tutaj możesz zainicjować grę lokalną bez połączenia z serwerem
    router.push("/play/local") // przykładowe przekierowanie
  }

  // Handler dla trybu With Link
  const handleCreateLobby = () => {
    console.log("Creating lobby...")
    // Połączenie z serwerem po stronie API lub Socket.IO w celu utworzenia lobby
    // Po utworzeniu lobby przekieruj użytkownika do strony lobby np. /play/[lobbyId]
    router.push("/play/link") // przykładowe przekierowanie
  }

  // Handler dla trybu Online – wykorzystuje Socket.IO
  const handleFindOpponent = () => {
    console.log("Finding opponent online...")
    // Inicjujemy socket do serwera na porcie 4000
    const socket = io("http://localhost:4000")
    // Emitujemy zdarzenie do znalezienia przeciwnika
    socket.emit("findOpponent", { userId: "exampleUser" })
    // Nasłuchujemy odpowiedzi
    socket.on("opponentFound", (data) => {
      console.log("Opponent found:", data)
      // Przykładowo przekierowujemy do pokoju gry z otrzymanym id
      router.push(`/play/${data.gameId}`)
    })
    // Dodatkowa obsługa błędów lub innych zdarzeń może być dodana tutaj
  }

  // Definiujemy tryby gry wraz z przypisanymi handlerami
  const gameModes = [
    {
      title: "Local",
      description: "Play with a friend on the same computer.",
      icon: Users,
      action: "Start Local Game",
      onClick: handleStartLocalGame,
    },
    {
      title: "With Link",
      description: "Create a lobby and share the link with your friend.",
      icon: Link2,
      onClick: handleCreateLobby,
    },
    {
      title: "Online",
      description: "Play against a random opponent online.",
      icon: Server,
      action: "Find Opponent",
      onClick: handleFindOpponent,
    },
  ]

  return (
    <motion.div
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sidebar text-foreground flex flex-col items-center justify-start p-4 pt-[15vh] relative overflow-hidden flex-grow"
    >
      {/* Animated background elements */}
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

      <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
        {gameModes.map((mode) => (
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
                className="mt-auto w-full bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={mode.onClick}
              >
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                  {mode.action || "Enter"}
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

      {/* "Join Game via Code" button and inline input with "Join Lobby" button placed outside the card grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 w-full max-w-4xl flex flex-col items-center gap-4"
      >
        <MotionButton
          className="w-1/2 bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJoinInput((prev) => !prev)}
        >
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            Join Game via Code
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

        {showJoinInput && (
          <div className="flex flex-row items-center gap-4 mt-4 w-1/2">
            <motion.input
              type="text"
              value={joinCode}
              onChange={handleJoinCodeChange}
              placeholder="Enter 5-character code"
              maxLength={5}
              className="flex-1 p-2 border border-gray-300 rounded shadow-lg text-center bg-background text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <MotionButton
              className="flex-1 bg-popover-foreground hover:bg-primary border border-[hsla(var(--foreground),0.1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log("Joining lobby with code:", joinCode)
                // Tutaj możesz wyemitować zdarzenie Socket.IO lub wywołać API do dołączenia do lobby
                router.push(`/play/${joinCode}`)
              }}
            >
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                Join Lobby
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
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
