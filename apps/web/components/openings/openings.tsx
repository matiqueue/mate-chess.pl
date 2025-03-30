"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  BookOpen,
  Clock,
  ArrowRight,
  CastleIcon as ChessKnight,
  PianoIcon as ChessPawn,
  RocketIcon as ChessRook,
  DiamondIcon as ChessQueen,
  CastleIcon as ChessKing,
  ChurchIcon as ChessBishop,
  PuzzleIcon as Chess,
  User,
} from "lucide-react"

/**
 * Interfejs ChessOpening
 *
 * Definiuje strukturę obiektu reprezentującego otwarcie szachowe.
 *
 * @property {number} id - Unikalny identyfikator otwarcia.
 * @property {string} title - Tytuł otwarcia.
 * @property {string} description - Opis otwarcia.
 * @property {React.ReactNode} icon - Ikona reprezentująca otwarcie.
 * @property {string} duration - Czas trwania nauki otwarcia.
 * @property {string} difficulty - Poziom trudności otwarcia.
 * @property {string} author - Autor otwarcia.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 * @source Własna implementacja
 */
interface ChessOpening {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  duration: string
  difficulty: string
  author: string
}

/**
 * ChessOpenings
 *
 * Komponent renderujący stronę z otwarciami szachowymi. Wyświetla baner informacyjny
 * oraz listę popularnych otwarć z ich opisami, poziomami trudności i autorami.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę z otwarciami szachowymi.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export default function ChessOpenings() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "начальный":
      case "początkujący":
        return "bg-green-500 opacity-70" // Kolor dla Beginner
      case "intermediate":
      case "средний":
      case "średniozaawansowany":
        return "bg-yellow-500 opacity-70" // Kolor dla Intermediate
      case "advanced":
      case "zaawansowany":
      case "продвинутый":
        return "bg-red-500 opacity-70" // Kolor dla Advanced
      default:
        return "bg-gray-400" // Domyślny kolor
    }
  }

  const chessOpenings: ChessOpening[] = [
    {
      id: 1,
      title: t("openingsPage.openings.opening1.title"),
      description: t("openingsPage.openings.opening1.description"),
      icon: <ChessPawn className="h-10 w-10" />,
      duration: "30 " + t("openingsPage.openings.time"),
      difficulty: t("openingsPage.openings.opening1.difficulty"),
      author: "Magnus Carlsen",
    },
    {
      id: 2,
      title: t("openingsPage.openings.opening2.title"),
      description: t("openingsPage.openings.opening2.description"),
      icon: <ChessKnight className="h-10 w-10" />,
      duration: "45 " + t("openingsPage.openings.time"),
      difficulty: t("openingsPage.openings.opening2.difficulty"),
      author: "Garry Kasparov",
    },
    {
      id: 3,
      title: t("openingsPage.openings.opening3.title"),
      description: t("openingsPage.openings.opening3.description"),
      icon: <ChessQueen className="h-10 w-10" />,
      duration: "40 " + t("openingsPage.openings.time"),
      difficulty: t("openingsPage.openings.opening3.difficulty"),
      author: "Anatoly Karpov",
    },
    {
      id: 4,
      title: t("openingsPage.openings.opening4.title"),
      description: t("openingsPage.openings.opening4.description"),
      icon: <ChessBishop className="h-10 w-10" />,
      duration: "35 " + t("openingsPage.openings.time"),
      difficulty: t("openingsPage.openings.opening4.difficulty"),
      author: "Bobby Fischer",
    },
    {
      id: 5,
      title: t("openingsPage.openings.opening5.title"),
      description: t("openingsPage.openings.opening5.description"),
      icon: <ChessKing className="h-10 w-10" />,
      duration: "50 " + t("openingsPage.openings.time"),
      difficulty: t("openingsPage.openings.opening5.difficulty"),
      author: "Garry Kasparov",
    },
    {
      id: 6,
      title: t("openingsPage.openings.opening6.title"),
      description: t("openingsPage.openings.opening6.description"),
      icon: <ChessRook className="h-10 w-10" />,
      duration: "45 " + t("openingsPage.openings.time"),
      difficulty: t("openingsPage.openings.opening6.difficulty"),
      author: "Viswanathan Anand",
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
            className="mx-auto mb-4"
          >
            <BookOpen size={48} className="text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold">{t("openingsPage.loading", "Loading chess openings...")}</h2>
        </motion.div>
      </div>
    )
  } else {
    return (
      <div className="container mx-auto py-8 px-4">
        {/* Banner explaining why openings are important */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mb-12">
          <Card className="overflow-hidden relative">
            {/* Background image with transparent gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg m-5"
              style={{
                backgroundImage: "url('logo/openingsLogo.webp')", // Zmień na ścieżkę do swojego zdjęcia
              }}
            >
              {/* Transparent gradient */}
              <div
                className={
                  theme === "dark"
                    ? "bg-gradient-to-r from-black to-black/50 rounded-lg absolute inset-0"
                    : "bg-gradient-to-r from-white to-white/50 rounded-lg absolute inset-0"
                }
              ></div>
            </div>

            <div className="relative p-8 z-10">
              <h2 className="text-3xl font-bold mb-4">{t("openingsPage.banner.title")}</h2>
              <p className="text-lg mb-6">{t("openingsPage.banner.description")}</p>
              <Button size="lg" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{t("openingsPage.startLearing")}</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Chess openings */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t("openingsPage.popularOpenings")}</h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {chessOpenings.map((opening, index) => (
            <motion.div
              key={opening.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="p-6 h-full flex flex-col relative">
                  <div className="absolute top-6 left-6 text-primary">{opening.icon}</div>
                  <div className="flex flex-col flex-grow mt-14 pl-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl">{opening.title}</h3>
                      <Badge className={getDifficultyColor(opening.difficulty)}>{opening.difficulty}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-6 flex-grow">{opening.description}</p>

                    <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-2" />
                          <span>{opening.author}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{opening.duration}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                        <span>{t("openingsPage.learnOpening")}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }
}
