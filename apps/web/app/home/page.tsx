"use client"

import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { PuzzleIcon as PuzzlePiece, GraduationCap, Users, PlayCircle, Trophy, Timer, Zap, Bot } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Warianty animacji
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
  return (
    <div className="space-y-8 bg-sidebar">
      {/* Hero Section */}
      <motion.section
        className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 mix-blend-overlay">
          <Image src="/backgrounds/homeBgImage.png" alt="Chess board" fill className="object-cover opacity-30" />
        </div>
        <div className="relative p-8 md:p-12 lg:p-16">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Play Chess Online
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Master the Game of Kings
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              <Users size={16} />
              15,000+ Active Players
            </div>
            <div className="flex items-center gap-1">
              <PlayCircle size={16} />
              1,000+ Games in Progress
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              Daily Tournaments
            </div>
          </motion.div>
          <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/play">
                <Button size="lg" className="w-full sm:w-auto">
                  Play Online
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/bot">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Play vs Bot
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Grid z trybami gry */}
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
        {[
          { icon: Timer, title: "Bullet", desc: "1 min", bg: "bg-primary/10" },
          { icon: Zap, title: "Blitz", desc: "3+2", bg: "bg-primary/10" },
          { icon: Bot, title: "Computer", desc: "vs AI", bg: "bg-primary/10" },
          { icon: Trophy, title: "Tournament", desc: "Arena", bg: "bg-primary/10" },
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
                Daily Puzzles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Train your tactical skills with our curated collection puzzles.</p>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="w-full">Start Solving</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Chess Lessons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Learn from grandmasters and improve your chess understanding.</p>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="w-full">Start Learning</Button>
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
