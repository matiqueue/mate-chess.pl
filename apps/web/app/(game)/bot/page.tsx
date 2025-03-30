"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Crown, ArrowRight, User } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useUser } from "@clerk/nextjs"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { color } from "@chess-engine/types"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { createLucideIcon } from "lucide-react";

/**
 * Obiekt animacji kontenera.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

/**
 * Obiekt animacji pojedynczego elementu.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/**
 * Animacja unoszenia elementu.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
const floatingAnimation = {
  y: [0, 5, 0],
  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" },
}

const MotionButton = motion.create(Button)
const MotionCard = motion.create(Card)

/**
 * GameModeSelector
 *
 * Komponent umożliwiający wybór trybu gry (dla gry z botem) z animacjami przy użyciu framer-motion.
 * Każdy tryb zawiera tytuł, opis, przycisk oraz ikonę reprezentującą dany tryb.
 *
 * @returns {JSX.Element} Element JSX reprezentujący selektor trybu gry.
 *
 * @remarks
 * Autor: nasakrator i matiqueue
 */
export default function GameModeSelector() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useUser()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [botDifficulty, setBotDifficulty] = useState("")
  const [selectedColor, setSelectedColor] = useState("white")
  const [selectedGameType, setSelectedGameType] = useState("")
  const [selectedTimer, setSelectedTimer] = useState(300)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const gameModes = [
    {
      key: "beginner",
      title: t("playVsBot2.beginnerBot.title"),
      description: t("playVsBot2.beginnerBot.description"),
      buttonText: t("playVsBot2.beginnerBot.buttonText"),
      icon: User,
    },
    {
      key: "advance",
      title: t("playVsBot2.advancedBot.title"),
      description: t("playVsBot2.advancedBot.description"),
      buttonText: t("playVsBot2.advancedBot.buttonText"),
      icon: Star,
    },
    {
      key: "chessNaster",
      title: t("playVsBot2.chessGrandmaster.title"),
      description: t("playVsBot2.chessGrandmaster.description"),
      buttonText: t("playVsBot2.chessGrandmaster.buttonText"),
      icon: Crown,
    },
  ]

  const openAdvancedDialog = () => {
    setIsDialogOpen(true)
  }

  const openColorDialog = () => {
    setIsColorDialogOpen(true)
  }

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBotDifficulty(event.target.value)
  }

  const handleGoButtonClick = () => {
    console.log("Wybrany poziom trudności bota:", botDifficulty)

    if(isDialogOpen){
      if (botDifficulty === "1") {
        router.push(`/bot/ai/easy?selectedColor=${selectedColor}&gameType=${selectedTimer}`)
      } else if (botDifficulty === "2") {
        router.push(`/bot/ai/medium?selectedColor=${selectedColor}&gameType=${selectedTimer}`)
      } else if (botDifficulty === "3") {
        router.push(`/bot/ai/hard?selectedColor=${selectedColor}&gameType=${selectedTimer}`)
      } else {
        console.log("Nieprawidłowy poziom trudności bota")
      }
    }else if(isColorDialogOpen){
      if(selectedGameType == "beginner"){
        router.push(`/bot/ai/easy?selectedColor=${selectedColor}&gameType=${selectedTimer}`)
      }else{
        router.push(`/bot/chess-master?selectedColor=${selectedColor}&gameType=${selectedTimer}`) 
      }
    }
    

    setIsColorDialogOpen(false)
    setIsDialogOpen(false)
  }

  return (
    <ScrollArea>
      <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
        {theme === "dark" && (
          <motion.div
            className="absolute inset-0 sm:m-[5%] rounded-[70%_10%_90%_15%_/25%_60%_35%_50%]"
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
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-foreground flex flex-col items-center justify-start pt-[8vh] overflow-hidden flex-grow mx-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 py-10"
          >
            {t("selectGameMode")}
          </motion.h1>

          <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
            {gameModes.map((mode) => {
              const isOnline = mode.key === "online"
              return (
                <MotionCard
                  key={mode.key}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card/50 border border-border transition-transform duration-300"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 h-full relative">
                    <motion.div animate={floatingAnimation} className="p-3 rounded-full bg-background mb-2">
                      <mode.icon className="w-8 h-8" />
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-2xl md:text-3xl font-semibold text-center"
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
                      onClick={
                        mode.key === "advance"
                          ? openAdvancedDialog
                          : mode.key === "beginner"
                            ? () => { setSelectedGameType("beginner"); setIsColorDialogOpen(true) }
                            : () => { setSelectedGameType("chess-master"); setIsColorDialogOpen(true) }
                      }
                      disabled={isOnline && !user}
                    >
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                        {mode.buttonText}
                      </motion.span>
                      <motion.div className="ml-2" initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </MotionButton>
                  </CardContent>
                </MotionCard>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Dialog for advanced mode */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-opacity-90 bg-background">
          <DialogHeader>
            <DialogTitle>{t("selectBotDifficulty")}</DialogTitle>
            <DialogDescription>{t("enterDifficultyLevel")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Input type="number" value={botDifficulty} onChange={handleDifficultyChange} placeholder={t("difficultyLevel")} />

            <DialogHeader>
              <DialogTitle>{t("selectColorTitle")}</DialogTitle>
              <DialogDescription>{t("selectColorDesc")}</DialogDescription>
            </DialogHeader>
            <RadioGroup
              value={selectedColor} // Upewniamy się, że wartość jest poprawnie ustawiona
              onValueChange={(value) => {
                setSelectedColor(value);
              }}
              className="flex gap-4 justify-center"
            >
              {/* Biały pionek */}
              <label htmlFor="white" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedColor === color.White ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="white" id="white" className="sr-only" />
                  <ChessPawn className="h-16 w-16 text-white fill-white" />
                </div>
              </label>

              {/* Czarny pionek */}
              <label htmlFor="black" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedColor === color.Black ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="black" id="black" className="sr-only" />
                  <ChessPawn className="h-16 w-16 text-black fill-black" />
                </div>
              </label>
            </RadioGroup>
            
            
            <DialogHeader>
              <DialogTitle>{t("selectGameType")}</DialogTitle>
              <DialogDescription>{t("selectGameTypeDesc")}</DialogDescription>
            </DialogHeader>

            <RadioGroup
              value={selectedTimer.toString()} // Upewniamy się, że wartość jest poprawnie ustawiona
              onValueChange={(value) => {
                setSelectedTimer(parseInt(value));
              }}
              className="flex gap-4 justify-center"
            >
              <label htmlFor="time900" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedTimer === 900 ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="900" id="time900" className="sr-only" />
                  <p>Classic</p>
                </div>
              </label>

              <label htmlFor="time300" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedTimer === 300 ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="300" id="time300" className="sr-only" />
                  <p>Rapid</p>
                </div>
              </label>

              <label htmlFor="time120" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedTimer === 120 ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="120" id="time120" className="sr-only" />
                    <p>Blitz</p>
                </div>
              </label>
            </RadioGroup>

            <Button onClick={handleGoButtonClick}>{t("goNext")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-opacity-90 bg-background">
          <div className="flex flex-col space-y-4">
            <DialogHeader>
              <DialogTitle>{t("selectColorTitle")}</DialogTitle>
              <DialogDescription>{t("selectColorDesc")}</DialogDescription>
            </DialogHeader>
            <RadioGroup
              value={selectedColor} // Upewniamy się, że wartość jest poprawnie ustawiona
              onValueChange={(value) => {
                setSelectedColor(value);
              }}
              className="flex gap-4 justify-center"
            >
              {/* Biały pionek */}
              <label htmlFor="white" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedColor === color.White ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="white" id="white" className="sr-only" />
                  <ChessPawn className="h-16 w-16 text-white fill-white" />
                </div>
              </label>

              {/* Czarny pionek */}
              <label htmlFor="black" className="cursor-pointer">
                <div
                  className={`relative h-24 w-24 flex items-center justify-center border-2 rounded-md bg-primary/10 ${
                    selectedColor === color.Black ? "border-primary" : "border-input"
                  }`}
                >
                  <RadioGroupItem value="black" id="black" className="sr-only" />
                  <ChessPawn className="h-16 w-16 text-black fill-black" />
                </div>
              </label>
            </RadioGroup>
            <Button onClick={handleGoButtonClick}>{t("goNext")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}

export const ChessPawn = createLucideIcon("ChessPawn", [
  ["path", { d: "M12 2C9.79 2 8 3.79 8 6c0 1.47.8 2.75 2 3.45V11H8a1 1 0 0 0-1 1v2h10v-2a1 1 0 0 0-1-1h-2V9.45c1.2-.7 2-1.98 2-3.45 0-2.21-1.79-4-4-4Zm-4 14a2 2 0 0 0-2 2v2h12v-2a2 2 0 0 0-2-2H8Z", key: "1" }]
]);