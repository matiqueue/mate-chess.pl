"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Trophy, Brain, Lightbulb, ChevronLeft, PuzzleIcon as Chess } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label"
import { useTheme } from "next-themes"
import { cn } from "@workspace/ui/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { loadQuizProgress, saveQuizProgress, resetQuizProgress } from "@/utils/quizStorage"

type Option = {
  id: string
  text: string // key for translation, e.g.: "chessQuiz.quizzes.0.options.a"
}

type Quiz = {
  id: number
  question: string // key for translation, e.g.: "chessQuiz.quizzes.0.question"
  options: Option[]
  correctAnswer: string
  explanation: string // key for translation, e.g.: "chessQuiz.quizzes.0.explanation"
  image: string
}

type Quote = {
  quote: string // key for translation, e.g.: "chessQuiz.quotes.0.quote"
  author: string // key for translation, e.g.: "chessQuiz.quotes.0.author"
}

// Quiz texts are now stored as keys matching our translation files.
const chessQuizzes: Quiz[] = [
  {
    id: 1,
    question: "chessQuiz.quizzes.0.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.0.options.a" },
      { id: "b", text: "chessQuiz.quizzes.0.options.b" },
      { id: "c", text: "chessQuiz.quizzes.0.options.c" },
      { id: "d", text: "chessQuiz.quizzes.0.options.d" },
    ],
    correctAnswer: "c",
    explanation: "chessQuiz.quizzes.0.explanation",
    image: "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/PedroPinhata/phpZIuH5s.png",
  },
  {
    id: 2,
    question: "chessQuiz.quizzes.1.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.1.options.a" },
      { id: "b", text: "chessQuiz.quizzes.1.options.b" },
      { id: "c", text: "chessQuiz.quizzes.1.options.c" },
      { id: "d", text: "chessQuiz.quizzes.1.options.d" },
    ],
    correctAnswer: "b",
    explanation: "chessQuiz.quizzes.1.explanation",
    image: "https://www.thechesswebsite.com/wp-content/uploads/2012/07/ruy-lopez.jpg",
  },
  {
    id: 3,
    question: "chessQuiz.quizzes.2.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.2.options.a" },
      { id: "b", text: "chessQuiz.quizzes.2.options.b" },
      { id: "c", text: "chessQuiz.quizzes.2.options.c" },
      { id: "d", text: "chessQuiz.quizzes.2.options.d" },
    ],
    correctAnswer: "b",
    explanation: "chessQuiz.quizzes.2.explanation",
    image: "https://www.chess.com/bundles/web/images/offline-play/en-passant.c51a5.png",
  },
  {
    id: 4,
    question: "chessQuiz.quizzes.3.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.3.options.a" },
      { id: "b", text: "chessQuiz.quizzes.3.options.b" },
      { id: "c", text: "chessQuiz.quizzes.3.options.c" },
      { id: "d", text: "chessQuiz.quizzes.3.options.d" },
    ],
    correctAnswer: "c",
    explanation: "chessQuiz.quizzes.3.explanation",
    image: "https://www.chess.com/bundles/web/images/puzzles/zugzwang-puzzle.e9e0c.png",
  },
  {
    id: 5,
    question: "chessQuiz.quizzes.4.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.4.options.a" },
      { id: "b", text: "chessQuiz.quizzes.4.options.b" },
      { id: "c", text: "chessQuiz.quizzes.4.options.c" },
      { id: "d", text: "chessQuiz.quizzes.4.options.d" },
    ],
    correctAnswer: "d",
    explanation: "chessQuiz.quizzes.4.explanation",
    image: "https://www.chess.com/bundles/web/images/offline-play/stalemate.c7c8e.png",
  },
  {
    id: 6,
    question: "chessQuiz.quizzes.5.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.5.options.a" },
      { id: "b", text: "chessQuiz.quizzes.5.options.b" },
      { id: "c", text: "chessQuiz.quizzes.5.options.c" },
      { id: "d", text: "chessQuiz.quizzes.5.options.d" },
    ],
    correctAnswer: "b",
    explanation: "chessQuiz.quizzes.5.explanation",
    image: "https://www.chess.com/bundles/web/images/offline-play/pieces/neo/150/wn.d1e8b.png",
  },
  {
    id: 7,
    question: "chessQuiz.quizzes.6.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.6.options.a" },
      { id: "b", text: "chessQuiz.quizzes.6.options.b" },
      { id: "c", text: "chessQuiz.quizzes.6.options.c" },
      { id: "d", text: "chessQuiz.quizzes.6.options.d" },
    ],
    correctAnswer: "c",
    explanation: "chessQuiz.quizzes.6.explanation",
    image: "https://www.chess.com/bundles/web/images/puzzles/anastasia-mate.c7c8e.png",
  },
  {
    id: 8,
    question: "chessQuiz.quizzes.7.question",
    options: [
      { id: "a", text: "chessQuiz.quizzes.7.options.a" },
      { id: "b", text: "chessQuiz.quizzes.7.options.b" },
      { id: "c", text: "chessQuiz.quizzes.7.options.c" },
      { id: "d", text: "chessQuiz.quizzes.7.options.d" },
    ],
    correctAnswer: "d",
    explanation: "chessQuiz.quizzes.7.explanation",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Jos%C3%A9_Ra%C3%BAl_Capablanca_1931.jpg",
  },
]

const chessQuotes: Quote[] = [
  {
    quote: "chessQuiz.quotes.0.quote",
    author: "chessQuiz.quotes.0.author",
  },
  {
    quote: "chessQuiz.quotes.1.quote",
    author: "chessQuiz.quotes.1.author",
  },
  {
    quote: "chessQuiz.quotes.2.quote",
    author: "chessQuiz.quotes.2.author",
  },
  {
    quote: "chessQuiz.quotes.3.quote",
    author: "chessQuiz.quotes.3.author",
  },
  {
    quote: "chessQuiz.quotes.4.quote",
    author: "chessQuiz.quotes.4.author",
  },
]

const chessFacts: string[] = ["chessQuiz.facts.0", "chessQuiz.facts.1", "chessQuiz.facts.2", "chessQuiz.facts.3", "chessQuiz.facts.4"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { y: -20, opacity: 0 },
}

export default function PuzzlesClient() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<"quiz" | "learn">("quiz")
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [randomQuote, setRandomQuote] = useState<Quote>(chessQuotes[0])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isProgressLoaded, setIsProgressLoaded] = useState<boolean>(false)

  const currentQuiz: Quiz = chessQuizzes[currentQuizIndex]
  const progress: number = ((currentQuizIndex + (isAnswered ? 1 : 0)) / chessQuizzes.length) * 100

  useEffect(() => {
    const storedProgress = loadQuizProgress()
    if (storedProgress) {
      setCurrentQuizIndex(storedProgress.currentQuizIndex)
      setScore(storedProgress.score)
      setQuizCompleted(storedProgress.quizCompleted)
    }
    setIsProgressLoaded(true)
  }, [])

  useEffect(() => {
    if (!isProgressLoaded) return
    saveQuizProgress({ currentQuizIndex, score, quizCompleted })
  }, [currentQuizIndex, score, quizCompleted, isProgressLoaded])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    const quoteIndex = Math.floor(Math.random() * chessQuotes.length)
    setRandomQuote(chessQuotes[quoteIndex])
    return () => clearTimeout(timer)
  }, [])

  const handleAnswerSelect = (value: string) => {
    if (!isAnswered) setSelectedAnswer(value)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return
    if (!isAnswered) {
      setIsAnswered(true)
      if (selectedAnswer === currentQuiz.correctAnswer) {
        setScore((prev) => prev + 1)
      }
    } else {
      if (currentQuizIndex < chessQuizzes.length - 1) {
        setCurrentQuizIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
      } else {
        setQuizCompleted(true)
      }
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex((prev) => prev - 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuizIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
    resetQuizProgress()
  }

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
            <Chess size={48} className="text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold">{t("quiz.loading")}</h2>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="container mx-auto py-8 px-4 max-w-full">
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className={cn(
          "relative overflow-hidden rounded-xl mb-12",
          theme === "light" ? "bg-white text-black" : "bg-gradient-to-r from-gray-900 to-gray-800 text-white",
        )}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
            alt="Chess background"
            className="w-full h-full object-cover"
          />
          <div className={cn("absolute inset-0", theme === "light" ? "bg-white opacity-20" : "bg-black opacity-60")}></div>
        </div>
        <div className="relative z-10 p-8 md:p-12 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="max-w-3xl mx-auto">
            <blockquote className="text-xl md:text-2xl italic mb-4">"{t(randomQuote.quote)}"</blockquote>
            <p className="text-lg">— {t(randomQuote.author)}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div variants={itemVariants} className="relative mb-5 flex justify-center">
        <div className="w-full max-w-200 flex justify-around p-2 border border rounded-lg px-6 pt-3 pb-4">
          <Button variant="ghost" className="relative px-8 py-4 text-4xl font-bold" onClick={() => setActiveTab("quiz")}>
            {t("tabs.quiz")}
            {activeTab === "quiz" && <motion.div layoutId="underline" className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full" />}
          </Button>
          <Button variant="ghost" className="relative px-8 py-4 text-4xl font-bold" onClick={() => setActiveTab("learn")}>
            {t("tabs.learn")}
            {activeTab === "learn" && <motion.div layoutId="underline" className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full" />}
          </Button>
        </div>
      </motion.div>

      {/* Progress Bar for Quiz */}
      {activeTab === "quiz" && (
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <div className="w-full max-w-2xl mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-md font-medium">{t("quiz.progress", "Progress")}</span>
              <span className="text-md font-medium">{Math.round(progress)}%</span>
            </div>
            <div className={cn("w-full rounded-full h-4", theme === "light" ? "bg-gray-300" : "bg-stone-800")}>
              <motion.div
                initial={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {activeTab === "quiz" ? (
          <motion.div
            key="quiz-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {!quizCompleted ? (
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("quiz.questionLabel", { current: currentQuizIndex + 1, total: chessQuizzes.length })}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{t(currentQuiz.question)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                    {currentQuiz.options.map((option) => (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-4 cursor-pointer transition-colors",
                          isAnswered && option.id === currentQuiz.correctAnswer && "border-green-500 bg-green-50 dark:bg-green-950/20",
                          isAnswered &&
                            selectedAnswer === option.id &&
                            option.id !== currentQuiz.correctAnswer &&
                            "border-red-500 bg-red-50 dark:bg-red-950/20",
                          !isAnswered && "hover:bg-accent",
                        )}
                        onClick={() => handleAnswerSelect(option.id)}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={`option-${option.id}`}
                          disabled={isAnswered}
                          className={cn(
                            isAnswered && option.id === currentQuiz.correctAnswer && "text-green-500 border-green-500",
                            isAnswered && selectedAnswer === option.id && option.id !== currentQuiz.correctAnswer && "text-red-500 border-red-500",
                          )}
                        />
                        <Label htmlFor={`option-${option.id}`} className="flex-1 text-base font-medium">
                          {option.id.toUpperCase()}. {t(option.text)}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-4 bg-muted rounded-md overflow-hidden"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-1">{t("quiz.explanation")}</h4>
                            <p>{t(currentQuiz.explanation)}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuizIndex === 0} className="flex items-center">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t("quiz.previous")}
                  </Button>
                  <Button onClick={handleSubmit} disabled={!selectedAnswer} className="flex items-center">
                    {isAnswered ? (
                      currentQuizIndex < chessQuizzes.length - 1 ? (
                        <>
                          {t("quiz.nextQuestion")}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        t("quiz.seeResults")
                      )
                    ) : (
                      t("quiz.checkAnswer")
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="w-full max-w-2xl mx-auto text-center">
                  <CardHeader>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="flex justify-center mb-4"
                    >
                      <Trophy className="h-20 w-20 text-primary" />
                    </motion.div>
                    <CardTitle className="text-3xl">{t("quiz.quizCompleted")}</CardTitle>
                    <CardDescription className="text-xl mt-2">{t("quiz.score", { score, total: chessQuizzes.length })}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      animate={{ width: `${(score / chessQuizzes.length) * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-4 bg-primary rounded-full mb-6 mx-auto"
                    />
                    <div className="text-lg mb-6">
                      {score === chessQuizzes.length
                        ? t("quiz.perfect")
                        : score >= chessQuizzes.length * 0.7
                          ? t("quiz.great")
                          : score >= chessQuizzes.length * 0.5
                            ? t("quiz.good")
                            : t("quiz.keepPracticing")}
                    </div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="p-4 bg-muted rounded-lg">
                      <h3 className="font-bold mb-2">{t("quiz.didYouKnow")}</h3>
                      <p>{t(chessFacts[Math.floor(Math.random() * chessFacts.length)])}</p>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button onClick={resetQuiz} className="px-8">
                      {t("quiz.tryAgain")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="learn-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen w-full"
          >
            <div className="w-full px-4 py-8 space-y-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold">{t("learn.learnChess")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{t("learn.description")}</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">{t("learn.historyTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t("learn.historyDescription")}</p>
                  <p className="mt-2">{t("learn.historyNote")}</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">{t("learn.basicsTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{t("learn.basicsDescription")}</p>
                  <ul className="list-disc list-inside">
                    <li>{t("learn.basicsList.pawn")}</li>
                    <li>{t("learn.basicsList.knight")}</li>
                    <li>{t("learn.basicsList.bishop")}</li>
                    <li>{t("learn.basicsList.rook")}</li>
                    <li>{t("learn.basicsList.queen")}</li>
                    <li>{t("learn.basicsList.king")}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">{t("learn.tacticsTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t("learn.tacticsDescription")}</p>
                  <p className="mt-2">{t("learn.tacticsNote")}</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">{t("learn.mastersTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t("learn.mastersDescription")}</p>
                </CardContent>
              </Card>
              <div className="text-center">
                <Button variant="outline" onClick={() => window.open("https://www.chess.com", "_blank")}>
                  {t("learn.moreInfo")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
