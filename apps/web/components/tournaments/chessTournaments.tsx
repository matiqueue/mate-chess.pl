"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Users, Calendar, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "next-themes"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

const MotionCard = motion(Card)

interface Tournament {
  id: number
  name: string
  startDate: Date
  endDate: Date
  participants: number
  maxParticipants: number
  status: "upcoming" | "active" | "finished"
  winner?: string
  logo: string
}

const tournaments: Tournament[] = [
  {
    id: 1,
    name: "Spring Chess Championship",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 2, 15),
    participants: 64,
    maxParticipants: 64,
    status: "finished",
    winner: "Magnus Carlsen",
    logo: "/logo/tournamentlogo.png",
  },
  {
    id: 2,
    name: "Summer Blitz Tournament",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 5, 7),
    participants: 32,
    maxParticipants: 32,
    status: "active",
    logo: "/logo/tournamentlogo.png",
  },
  {
    id: 3,
    name: "Autumn Rapid Challenge",
    startDate: new Date(2024, 8, 15),
    endDate: new Date(2024, 8, 22),
    participants: 16,
    maxParticipants: 32,
    status: "active",
    logo: "/logo/tournamentlogo.png",
  },
  {
    id: 4,
    name: "Winter Chess Festival",
    startDate: new Date(2024, 11, 26),
    endDate: new Date(2025, 0, 2),
    participants: 0,
    maxParticipants: 128,
    status: "upcoming",
    logo: "/logo/tournamentlogo.png",
  },
]

const floatingAnimation = {
  y: [0, 5, 0],
  transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const, ease: "easeInOut" },
}

export default function ChessTournaments() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const { theme } = useTheme()
  const [isWideScreen, setIsWideScreen] = useState(false)

  console.log(isDragging)

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1400)
    }
    handleResize() // Wywołaj raz na początku
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0))
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, tournaments.length - 1))
  const handleReset = () => setCurrentIndex(1)

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
  }

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false)
    const dragEndX = e.clientX
    const diff = dragEndX - dragStartX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev()
      else handleNext()
    }
  }

  const formatDate = (date: Date) => date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const isRegistrationActive = (tournament: Tournament) => {
    const now = new Date()
    return tournament.status === "upcoming" && tournament.participants < tournament.maxParticipants && tournament.startDate > now
  }

  if (!tournaments[0]) {
    return ""
  }

  return (
    <ScrollArea className="w-full">
      <div className="relative w-full min-h-screen p-10">
        {theme === "dark" && (
          <motion.div
            className="absolute inset-0 sm:m-[5%] rounded-[70%_20%_90%_15%_/15%_60%_25%_40%]"
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
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 text-foreground flex flex-col items-center justify-center h-screen w-full"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">Chess Tournaments</h1>

          <div className="relative w-full md:w-[70vw] mb-4">
            <div
              className="flex justify-center items-center overflow-hidden h-[500px]"
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={() => setIsDragging(false)}
            >
              <AnimatePresence initial={false}>
                {tournaments.map((tournament, index) => (
                  <MotionCard
                    key={tournament.id}
                    className={`absolute w-full max-w-[400px] h-[450px] transition-all duration-300`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: (isWideScreen && index >= currentIndex - 1 && index <= currentIndex + 1) || (!isWideScreen && index === currentIndex) ? 1 : 0,
                      scale: index === currentIndex ? 1.1 : 0.9,
                      x: (index - currentIndex) * (isWideScreen ? 400 : 0),
                      zIndex: index === currentIndex ? 30 : isWideScreen ? 20 : 10,
                    }}
                    transition={{ duration: 0.5, zIndex: { delay: index === currentIndex ? 0 : 0.2 } }}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-between h-full">
                      <motion.img src={tournament.logo} alt={`${tournament.name} logo`} className="w-32 h-32 mb-4" animate={floatingAnimation} />
                      <h3 className="text-2xl font-semibold mb-4 text-center">{tournament.name}</h3>
                      <div className="flex items-center mb-2">
                        <Calendar className="mr-2 h-5 w-5" />
                        <span>
                          {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        <Users className="mr-2 h-5 w-5" />
                        <span>
                          {tournament.participants}/{tournament.maxParticipants} Participants
                        </span>
                      </div>
                      {tournament.status === "upcoming" && (
                        <span className="text-yellow-500">
                          Starts in {Math.ceil((tournament.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      )}
                      {tournament.status === "active" && <span className="text-green-500">Tournament in progress</span>}
                      {tournament.status === "finished" && <span className="text-blue-500">Tournament finished</span>}
                      <Button
                        className="mt-4 w-full"
                        disabled={!isRegistrationActive(tournament)}
                        onClick={() => console.log(`Registered for ${tournament.name}`)}
                      >
                        {isRegistrationActive(tournament) ? "Register" : "Registration Closed"}
                      </Button>
                    </CardContent>
                  </MotionCard>
                ))}
              </AnimatePresence>
            </div>

            {/* Navigation buttons with improved styling */}
            <div className="flex justify-center items-center space-x-4 mt-4">
              <Button onClick={handlePrev} disabled={currentIndex === 0} className="z-20 rounded-full p-2" variant="outline">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button onClick={handleReset} className="z-20 rounded-full p-2" variant="outline">
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button onClick={handleNext} disabled={currentIndex === tournaments.length - 1} className="z-20 rounded-full p-2" variant="outline">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  )
}
