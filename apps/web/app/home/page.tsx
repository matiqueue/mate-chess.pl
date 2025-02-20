"use client"

import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { PuzzleIcon as PuzzlePiece, GraduationCap, Users, PlayCircle, Trophy, Timer, Zap, Bot } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-8 bg-sidebar">
      {/* Hero Section */}
      <motion.section
        className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/30 via-background to-background"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className={`absolute inset-0 ${theme === "dark" ? "" : "mix-blend-screen"}`}>
          <Image
            src="/backgrounds/homeBgImage.png"
            alt={t("chessBoard")}
            fill
            className={`object-cover ${theme === "dark" ? "opacity-30" : "opacity-10"}`}
          />
        </div>
        <div className="relative p-8 md:p-12 lg:p-16">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("playChessOnline")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t("masterTheGameOfKings")}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              <Users size={16} />
              15,000+ {t("activePlayers")}
            </div>
            <div className="flex items-center gap-1">
              <PlayCircle size={16} />
              1,000+ {t("gamesInProgress")}
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              {t("dailyTournaments")}
            </div>
          </motion.div>
          <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/play">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("playOnline")}
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/bot">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t("playVsBot")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Grid z trybami gry */}
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        {[
          { icon: Timer, title: t("bullet"), desc: t("oneMin"), bg: "bg-primary/10" },
          { icon: Zap, title: t("blitz"), desc: t("threePlusTwo"), bg: "bg-primary/10" },
          { icon: Bot, title: t("computer"), desc: t("vsAi"), bg: "bg-primary/10" },
          { icon: Trophy, title: t("tournament"), desc: t("arena"), bg: "bg-primary/10" },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div key={idx} variants={fadeInUp} whileHover={{ scale: 1.05 }} className="w-full">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Grid z dodatkowymi funkcjami */}
      <motion.div className="grid md:grid-cols-2 gap-8" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PuzzlePiece className="h-5 w-5 text-primary" />
                {t("dailyPuzzles")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{t("trainTacticalSkills")}</p>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="w-full">{t("startSolving")}</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {t("chessLessons")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{t("learnFromGrandmasters")}</p>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="w-full">{t("startLearning")}</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Dodatkowy animowany element – latający, obracający się Bot */}
      <motion.div
        className="fixed bottom-4 right-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
          <Link href="/easter-egg">
            <Bot className="h-10 w-10 text-primary" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
