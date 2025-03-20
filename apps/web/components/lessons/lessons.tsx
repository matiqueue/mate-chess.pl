"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
  Star,
  Users,
  CheckCircle2,
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
  instructor: {
    name: string
    avatar: string
    title: string
  }
  rating: number
  studentsCount: number
  duration: string
  learningPoints: string[]
  topics: string[]
  progress: number
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
    instructor: {
      name: t("lessonPage.recomendedLesson.instructor.name"),
      avatar: "/placeholder.svg?height=50&width=50",
      title: t("lessonPage.recomendedLesson.instructor.title"),
    },
    rating: 4.8,
    studentsCount: 1245,
    duration: t("lessonPage.recomendedLesson.duration"),
    learningPoints: [
      t("lessonPage.recomendedLesson.learningPoints.0"),
      t("lessonPage.recomendedLesson.learningPoints.1"),
      t("lessonPage.recomendedLesson.learningPoints.2"),
      t("lessonPage.recomendedLesson.learningPoints.3"),
    ],
    topics: [
      t("lessonPage.recomendedLesson.topics.0"),
      t("lessonPage.recomendedLesson.topics.1"),
      t("lessonPage.recomendedLesson.topics.2"),
      t("lessonPage.recomendedLesson.topics.3"),
    ],
    progress: 0,
  };

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

// Helper function to render stars
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? "text-yellow-500 fill-yellow-500"
              : i === fullStars && hasHalfStar
                ? "text-yellow-500 fill-yellow-500"
                : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}



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
            <div className="sm:w-2/5 relative ml-5">
              <img
                src={featuredLesson.image || "/placeholder.svg"}
                alt={featuredLesson.title}
                className="h-64 sm:h-full w-full object-cover rounded-lg"
              />
            </div>
            <div className="sm:w-3/5 p-6 flex flex-col">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">{t("lessonPage.recomendedLesson.progress")}</span>
                  <span className="text-xs font-medium">{featuredLesson.progress}%</span>
                </div>
                <Progress value={featuredLesson.progress} className="h-2" />
              </div>

              {/* Title and description */}
              <h3 className="text-2xl font-bold mb-3">{featuredLesson.title}</h3>
              <p className="text-muted-foreground mb-4">{featuredLesson.description}</p>

              {/* Instructor info */}
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={featuredLesson.instructor.avatar} alt={featuredLesson.instructor.name} />
                  <AvatarFallback>JK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{featuredLesson.instructor.name}</p>
                  <p className="text-xs text-muted-foreground">{featuredLesson.instructor.title}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{featuredLesson.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{featuredLesson.studentsCount} {t("lessonPage.recomendedLesson.students")}</span>
                </div>
                <RatingStars rating={featuredLesson.rating} />
              </div>

              {/* Topics */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {featuredLesson.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* What you'll learn */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {t("lessonPage.recomendedLesson.learn")}
                </h4>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  {featuredLesson.learningPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Button size="lg" className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  <span>{t("lessonPage.recomendedLesson.buttonJoin")}</span>
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{t("lessonPage.recomendedLesson.buttonRead")}</span>
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

