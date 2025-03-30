"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Users, Calendar, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "next-themes"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useTranslation } from "react-i18next"

const MotionCard = motion(Card)

/**
 * Interfejs Tournament
 *
 * Definiuje strukturę obiektu reprezentującego turniej szachowy.
 *
 * @property {number} id - Unikalny identyfikator turnieju.
 * @property {string} nameKey - Klucz nazwy turnieju używany w tłumaczeniach.
 * @property {Date} startDate - Data rozpoczęcia turnieju.
 * @property {Date} endDate - Data zakończenia turnieju.
 * @property {number} participants - Liczba aktualnych uczestników.
 * @property {number} maxParticipants - Maksymalna liczba uczestników.
 * @property {"upcoming" | "active" | "finished"} status - Status turnieju.
 * @property {string} [winner] - Nazwa zwycięzcy (opcjonalne, dla zakończonych turniejów).
 * @property {string} logo - URL logo turnieju.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface Tournament {
  id: number
  nameKey: string
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
    nameKey: "springChessChampionship",
    startDate: new Date(Date.UTC(2024, 2, 1)),
    endDate: new Date(Date.UTC(2024, 2, 15)),
    participants: 64,
    maxParticipants: 64,
    status: "finished",
    winner: "Magnus Carlsen",
    logo: "/logo/tournamentlogo.png",
  },
  {
    id: 2,
    nameKey: "summerBlitzTournament",
    startDate: new Date(Date.UTC(2024, 5, 1)),
    endDate: new Date(Date.UTC(2024, 5, 7)),
    participants: 32,
    maxParticipants: 32,
    status: "active",
    logo: "/logo/tournamentlogo.png",
  },
  {
    id: 3,
    nameKey: "autumnRapidChallenge",
    startDate: new Date(Date.UTC(2024, 8, 15)),
    endDate: new Date(Date.UTC(2024, 8, 22)),
    participants: 16,
    maxParticipants: 32,
    status: "active",
    logo: "/logo/tournamentlogo.png",
  },
  {
    id: 4,
    nameKey: "winterChessFestival",
    startDate: new Date(Date.UTC(2024, 11, 26)),
    endDate: new Date(Date.UTC(2025, 0, 2)),
    participants: 0,
    maxParticipants: 128,
    status: "upcoming",
    logo: "/logo/tournamentlogo.png",
  },
]

const floatingAnimation = {
  y: [0, 5, 0],
  transition: {
    duration: 1.5,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  },
}

/**
 * ChessTournaments
 *
 * Główny komponent strony wyświetlającej turnieje szachowe.
 * Umożliwia przeglądanie listy turniejów w formie karuzeli z animacjami,
 * obsługuje przeciąganie myszą oraz rejestrację na nadchodzące turnieje.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę z turniejami szachowymi.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export default function ChessTournaments() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const { theme } = useTheme()

  const [isWideScreen, setIsWideScreen] = useState<boolean | null>(null)
  const [daysUntilStart, setDaysUntilStart] = useState<number[]>([])

  useEffect(() => {
    const now = new Date()
    const updated = tournaments.map((t) => {
      if (t.status === "upcoming") {
        return Math.ceil((t.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }
      return 0
    })
    setDaysUntilStart(updated)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1600)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isWideScreen === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

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

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date)

  const isRegistrationActive = (tournament: Tournament) => {
    const now = new Date()
    return tournament.status === "upcoming" && tournament.participants < tournament.maxParticipants && tournament.startDate > now
  }

  return (
    <div className="relative w-full">
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
        className="text-foreground flex flex-col items-center w-full py-10"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">{t("chessTournaments.heading")}</h1>

        <div className="relative w-full md:w-[70vw]">
          <div
            className="flex justify-center items-center overflow-hidden h-[50vh]"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => setIsDragging(false)}
          >
            <AnimatePresence initial={false}>
              {tournaments.map((tournament, index) => (
                <MotionCard
                  key={tournament.id}
                  className="absolute w-full max-w-[350px] h-[50vh] transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: (isWideScreen && index >= currentIndex - 1 && index <= currentIndex + 1) || (!isWideScreen && index === currentIndex) ? 1 : 0,
                    scale: index === currentIndex ? 1.1 : 0.9,
                    x: (index - currentIndex) * (isWideScreen ? 430 : 0),
                    zIndex: index === currentIndex ? 30 : isWideScreen ? 20 : 10,
                  }}
                  transition={{ duration: 0.5, zIndex: { delay: index === currentIndex ? 0 : 0.2 } }}
                >
                  <CardContent className="p-2 flex flex-col items-center justify-between h-full">
                    <motion.img
                      src={tournament.logo}
                      alt={`${t("chessTournaments.tournamentNames." + tournament.nameKey)} logo`}
                      className="w-32 h-32 mb-4"
                      animate={floatingAnimation}
                    />
                    <h3 className="text-2xl font-semibold mb-4 text-center">{t("chessTournaments.tournamentNames." + tournament.nameKey)}</h3>
                    <div className="flex items-center mb-2">
                      <Calendar className="mr-2 h-5 w-5" />
                      <span>
                        {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center mb-4">
                      <Users className="mr-2 h-5 w-5" />
                      <span>
                        {tournament.participants}/{tournament.maxParticipants} {t("chessTournaments.participants")}
                      </span>
                    </div>
                    {tournament.status === "upcoming" && (
                      <span className="text-yellow-500">
                        {t("chessTournaments.startsIn", {
                          days: daysUntilStart[index],
                        })}
                      </span>
                    )}
                    {tournament.status === "active" && <span className="text-green-500">{t("chessTournaments.inProgress")}</span>}
                    {tournament.status === "finished" && <span className="text-blue-500">{t("chessTournaments.finished")}</span>}
                    <Button
                      className="mt-4 w-full"
                      disabled={!isRegistrationActive(tournament)}
                      onClick={() => console.log(`Registered for ${t("chessTournaments.tournamentNames." + tournament.nameKey)}`)}
                    >
                      {isRegistrationActive(tournament) ? t("chessTournaments.register") : t("chessTournaments.registrationClosed")}
                    </Button>
                  </CardContent>
                </MotionCard>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-4 pt-5">
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
  )
}
