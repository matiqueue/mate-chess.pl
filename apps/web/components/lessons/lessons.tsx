"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import {
  BookOpen,
  UserPlus,
  Clock,
  ArrowRight,
  GraduationCap,
  CastleIcon as ChessKnight,
  PianoIcon as ChessPawn,
  RocketIcon as ChessRook,
  DiamondIcon as ChessQueen,
  CastleIcon as ChessKing,
  ChurchIcon as ChessBishop,
  PuzzleIcon as Chess
} from "lucide-react"


// Define the lesson types
interface FeaturedLesson {
  id: number
  title: string
  description: string
  buttonJoin: string
  buttonRead: string
  image: string
}

interface SmallLesson {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  duration: string
}


export default function ChessLessons() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  // Sample featured lesson
const featuredLesson: FeaturedLesson = {
  id: 1,
  title: t("lessonPage.recomendedLesson.title"),
  description: t("lessonPage.recomendedLesson.description"),
  buttonJoin: t("lessonPage.recomendedLesson.buttonJoin"),
  buttonRead: t("lessonPage.recomendedLesson.buttonRead"),
  image: "logo/lessonsLogo.webp",
}

// Sample smaller lessons
const smallLessons: SmallLesson[] = [
  {
    id: 1,
    title: t("lessonPage.popularLessons.lesson1.title"),
    description: t("lessonPage.popularLessons.lesson1.description"),
    icon: <ChessPawn className="h-10 w-10" />,
    duration: "30 " + t("lessonPage.popularLessons.time"),
  },
  {
    id: 2,
    title: t("lessonPage.popularLessons.lesson2.title"),
    description: t("lessonPage.popularLessons.lesson2.description"),
    icon: <ChessKnight className="h-10 w-10" />,
    duration: "45 " + t("lessonPage.popularLessons.time"),
  },
  {
    id: 3,
    title: t("lessonPage.popularLessons.lesson3.title"),
    description: t("lessonPage.popularLessons.lesson3.description"),
    icon: <ChessRook className="h-10 w-10" />,
    duration: "40 " + t("lessonPage.popularLessons.time"),
  },
  {
    id: 4,
    title: t("lessonPage.popularLessons.lesson4.title"),
    description: t("lessonPage.popularLessons.lesson4.description"),
    icon: <ChessBishop className="h-10 w-10" />,
    duration: "35 " + t("lessonPage.popularLessons.time"),
  },
  {
    id: 5,
    title: t("lessonPage.popularLessons.lesson5.title"),
    description: t("lessonPage.popularLessons.lesson5.description"),
    icon: <ChessQueen className="h-10 w-10" />,
    duration: "50 " + t("lessonPage.popularLessons.time"),
  },
  {
    id: 6,
    title: t("lessonPage.popularLessons.lesson6.title"),
    description: t("lessonPage.popularLessons.lesson6.description"),
    icon: <ChessKing className="h-10 w-10" />,
    duration: "45 " + t("lessonPage.popularLessons.time"),
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
              transition: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
            className="mx-auto mb-4"
          >
            <GraduationCap size={48} className="text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold">{t("lessonPage.loading")}</h2>
        </motion.div>
      </div>
    )
  }else{
  return (

    
    <div className="container mx-auto py-8 px-4">
      {/* Featured lesson */}
      <h2 className="text-3xl font-bold mb-6">{t("lessonPage.titles.recomendedLesson")}</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        whileHover={{ scale: 1.05 }}
        className="mb-12"
      >
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-2/5 relative ml-4 ">
              <img
                src={featuredLesson.image || "/placeholder.svg"}
                alt={featuredLesson.title}
                className="h-64 sm:h-full w-full object-cover rounded-lg"
              />
            </div>
            <div className="sm:w-3/5 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3">{featuredLesson.title}</h3>
                <p className="text-muted-foreground mb-6">{featuredLesson.description}</p>
              </div>
              <div className="flex flex-col xl:flex-row gap-3 mt-auto">
                <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => window.location.href = "https://www.chessable.com/?utm_source=chess.com&utm_medium=navigation&utm_campaign=learn_expanded"}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>{featuredLesson.buttonJoin}</span>
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => window.location.href = "https://www.chessable.com/?utm_source=chess.com&utm_medium=navigation&utm_campaign=learn_expanded"}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>{featuredLesson.buttonRead}</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Smaller lessons */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("lessonPage.titles.popularLessons")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {smallLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setHoveredId(lesson.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => window.location.href = "https://www.chessable.com/?utm_source=chess.com&utm_medium=navigation&utm_campaign=learn_expanded"}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="p-4 h-full flex flex-col relative">
                <div className="absolute top-4 left-4 text-primary">{lesson.icon}</div>
                <div className="flex flex-col flex-grow mt-14 pl-1">
                  <h3 className="font-bold mb-2">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{lesson.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{lesson.duration}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full">
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
  )}
}

