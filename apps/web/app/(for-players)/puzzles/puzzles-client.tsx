"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Trophy, Brain, Lightbulb, ChevronLeft, PuzzleIcon as Chess } from "lucide-react"
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
  text: string
}

type Quiz = {
  id: number
  question: string
  options: Option[]
  correctAnswer: string
  explanation: string
  image: string
}

type Quote = {
  quote: string
  author: string
}

const chessQuizzes: Quiz[] = [
  {
    id: 1,
    question: "Which piece can only move diagonally?",
    options: [
      { id: "a", text: "Rook" },
      { id: "b", text: "Knight" },
      { id: "c", text: "Bishop" },
      { id: "d", text: "Queen" },
    ],
    correctAnswer: "c",
    explanation:
      "The Bishop can only move diagonally, while the Rook moves horizontally and vertically, the Knight moves in an L-shape, and the Queen can move in any direction.",
    image: "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/PedroPinhata/phpZIuH5s.png",
  },
  {
    id: 2,
    question: "What is the name of the opening move 1.e4 e5 2.Nf3 Nc6 3.Bb5?",
    options: [
      { id: "a", text: "Italian Game" },
      { id: "b", text: "Ruy Lopez" },
      { id: "c", text: "Sicilian Defense" },
      { id: "d", text: "French Defense" },
    ],
    correctAnswer: "b",
    explanation:
      "The Ruy Lopez (also called the Spanish Opening) is one of the oldest and most classic chess openings, named after the Spanish priest Ruy López de Segura who analyzed it in 1561.",
    image: "https://www.thechesswebsite.com/wp-content/uploads/2012/07/ruy-lopez.jpg",
  },
  {
    id: 3,
    question: "What is 'en passant' in chess?",
    options: [
      { id: "a", text: "A special king move" },
      { id: "b", text: "A special pawn capture" },
      { id: "c", text: "A checkmate pattern" },
      { id: "d", text: "A draw offer" },
    ],
    correctAnswer: "b",
    explanation:
      "En passant is a special pawn capture that can occur when a pawn moves two squares forward from its starting position and lands beside an opponent's pawn.",
    image: "https://www.chess.com/bundles/web/images/offline-play/en-passant.c51a5.png",
  },
  {
    id: 4,
    question: "What does 'zugzwang' mean in chess?",
    options: [
      { id: "a", text: "A winning position" },
      { id: "b", text: "A draw by repetition" },
      { id: "c", text: "A position where any move worsens the situation" },
      { id: "d", text: "A special castling move" },
    ],
    correctAnswer: "c",
    explanation:
      "Zugzwang is a situation where a player is forced to make a move that will worsen their position, but they would prefer to pass and not move at all if that were allowed.",
    image: "https://www.chess.com/bundles/web/images/puzzles/zugzwang-puzzle.e9e0c.png",
  },
  {
    id: 5,
    question: "Which of these is NOT a way for a chess game to end in a draw?",
    options: [
      { id: "a", text: "Stalemate" },
      { id: "b", text: "Threefold repetition" },
      { id: "c", text: "Fifty-move rule" },
      { id: "d", text: "King capture" },
    ],
    correctAnswer: "d",
    explanation:
      "King capture is not a legal move in chess. The game ends before the king is captured. The other options are all legitimate ways for a game to end in a draw.",
    image: "https://www.chess.com/bundles/web/images/offline-play/stalemate.c7c8e.png",
  },
  {
    id: 6,
    question: "Which chess piece is worth 3 points?",
    options: [
      { id: "a", text: "Pawn" },
      { id: "b", text: "Knight" },
      { id: "c", text: "Rook" },
      { id: "d", text: "Queen" },
    ],
    correctAnswer: "b",
    explanation:
      "In standard piece valuation, a Knight is worth 3 points, a Bishop is worth 3 points, a Rook is worth 5 points, a Queen is worth 9 points, and a Pawn is worth 1 point.",
    image: "https://www.chess.com/bundles/web/images/offline-play/pieces/neo/150/wn.d1e8b.png",
  },
  {
    id: 7,
    question: "What is the name of the checkmate pattern where a queen and knight work together?",
    options: [
      { id: "a", text: "Scholar's Mate" },
      { id: "b", text: "Fool's Mate" },
      { id: "c", text: "Anastasia's Mate" },
      { id: "d", text: "Smothered Mate" },
    ],
    correctAnswer: "c",
    explanation:
      "Anastasia's Mate is a checkmate pattern where a knight and queen (or rook) work together to trap the enemy king against the side of the board.",
    image: "https://www.chess.com/bundles/web/images/puzzles/anastasia-mate.c7c8e.png",
  },
  {
    id: 8,
    question: "Which famous chess player was known as the 'Mozart of Chess'?",
    options: [
      { id: "a", text: "Garry Kasparov" },
      { id: "b", text: "Magnus Carlsen" },
      { id: "c", text: "Bobby Fischer" },
      { id: "d", text: "José Raúl Capablanca" },
    ],
    correctAnswer: "d",
    explanation:
      "José Raúl Capablanca was known as the 'Mozart of Chess' due to his natural talent and seemingly effortless playing style. He was world champion from 1921 to 1927.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Jos%C3%A9_Ra%C3%BAl_Capablanca_1931.jpg",
  },
]

const chessQuotes: Quote[] = [
  {
    quote: "Chess is the gymnasium of the mind.",
    author: "Blaise Pascal",
  },
  {
    quote: "Every chess master was once a beginner.",
    author: "Irving Chernev",
  },
  {
    quote: "Chess is life in miniature. Chess is a struggle, chess battles.",
    author: "Garry Kasparov",
  },
  {
    quote: "Chess is the art which expresses the science of logic.",
    author: "Mikhail Botvinnik",
  },
  {
    quote: "Chess is mental torture.",
    author: "Garry Kasparov",
  },
]

const chessFacts: string[] = [
  "The number of possible unique chess games is much greater than the number of electrons in the universe.",
  "The longest official chess game lasted 269 moves and ended in a draw.",
  "The word 'Checkmate' comes from the Persian phrase 'Shah Mat,' which means 'the king is dead.'",
  "The folding chess board was invented by a priest who was forbidden to play chess.",
  "The new chess piece – the queen – was introduced in the 15th century and was originally the weakest piece.",
]

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
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<"quiz" | "learn">("quiz")
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [randomQuote, setRandomQuote] = useState<Quote>(chessQuotes[0]!)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isProgressLoaded, setIsProgressLoaded] = useState<boolean>(false)

  const currentQuiz: Quiz = chessQuizzes[currentQuizIndex]!
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
    setRandomQuote(chessQuotes[quoteIndex]!)
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
          <h2 className="text-2xl font-bold">Loading Chess Puzzles...</h2>
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
            Chess Puzzles & Learning
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="max-w-3xl mx-auto">
            <blockquote className="text-xl md:text-2xl italic mb-4">"{randomQuote.quote}"</blockquote>
            <p className="text-lg">— {randomQuote.author}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs Navigation – wersja z podkreśleniem, powiększone do maxa */}
      <motion.div variants={itemVariants} className="relative mb-5 flex justify-center">
        <div className="w-full max-w-200 flex justify-around p-2 border border rounded-lg px-6 pt-3 pb-4">
          <Button variant="ghost" className="relative px-8 py-4 text-4xl font-bold" onClick={() => setActiveTab("quiz")}>
            Quiz
            {activeTab === "quiz" && <motion.div layoutId="underline" className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full" />}
          </Button>
          <Button variant="ghost" className="relative px-8 py-4 text-4xl font-bold" onClick={() => setActiveTab("learn")}>
            Learn
            {activeTab === "learn" && <motion.div layoutId="underline" className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full" />}
          </Button>
        </div>
      </motion.div>

      {/* Progress Bar – renderowany tylko dla Quiz, poza animowaną zawartością */}
      {activeTab === "quiz" && (
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <div className="w-full max-w-2xl mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-md font-medium">Progress</span>
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
                      Question {currentQuizIndex + 1} of {chessQuizzes.length}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{currentQuiz.question}</CardTitle>
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
                          {option.id.toUpperCase()}. {option.text}
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
                            <h4 className="font-semibold mb-1">Explanation:</h4>
                            <p>{currentQuiz.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuizIndex === 0} className="flex items-center">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} disabled={!selectedAnswer} className="flex items-center">
                    {isAnswered ? (
                      currentQuizIndex < chessQuizzes.length - 1 ? (
                        <>
                          Next Question
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        "See Results"
                      )
                    ) : (
                      "Check Answer"
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
                    <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                    <CardDescription className="text-xl mt-2">
                      You scored {score} out of {chessQuizzes.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      animate={{ width: `${(score / chessQuizzes.length) * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-4 bg-primary rounded-full mb-6 mx-auto"
                    />
                    <div className="text-lg mb-6">
                      {score === chessQuizzes.length ? (
                        <p>Perfect score! You&apos;re a chess master!</p>
                      ) : score >= chessQuizzes.length * 0.7 ? (
                        <p>Great job! You have excellent chess knowledge.</p>
                      ) : score >= chessQuizzes.length * 0.5 ? (
                        <p>Good effort! Keep studying to improve your chess knowledge.</p>
                      ) : (
                        <p>Keep practicing! Chess has a lot to learn.</p>
                      )}
                    </div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="p-4 bg-muted rounded-lg">
                      <h3 className="font-bold mb-2">Did you know?</h3>
                      <p>{chessFacts[Math.floor(Math.random() * chessFacts.length)]}</p>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button onClick={resetQuiz} className="px-8">
                      Try Again
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
            className="min-h-screen w-full" // pełna szerokość
          >
            <div className="w-full px-4 py-8 space-y-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold">Learn Chess</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    Szachy to gra, która rozwija nie tylko zdolności strategiczne, ale także logiczne myślenie, cierpliwość i zdolności analityczne. To nie
                    tylko rozgrywka, ale także sztuka, nauka i filozofia.
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">Historia Szachów</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Szachy mają długą i fascynującą historię, sięgającą starożytności. Gra była popularna wśród królów, wojowników oraz uczonych. Przez wieki
                    rozwijała się, przybierając różne formy i style. Pierwotnie znana jako "Chaturanga" w Indiach, szachy przeszły przez Persję, a następnie
                    trafiły do Europy, gdzie zyskały obecny kształt.
                  </p>
                  <p className="mt-2">Historia szachów to także historia kultury, sztuki i nauki, a każda epoka wnosiła coś nowego do tej królewskiej gry.</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">Podstawowe zasady</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Nauka szachów zaczyna się od opanowania podstawowych ruchów poszczególnych figur, zasad gry oraz celów. Każda figura ma unikalne
                    właściwości, a zrozumienie ich znaczenia to klucz do sukcesu.
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Ruchy pionka – tylko do przodu, z możliwością bicia po skosie.</li>
                    <li>Ruchy skoczka – w kształcie litery L, mogą przeskakiwać inne figury.</li>
                    <li>Ruchy gońca – po przekątnych, działające na długich przekątnych.</li>
                    <li>Ruchy wieży – poziomo i pionowo, kontrola linii i kolumn.</li>
                    <li>Ruchy hetmana – łączące możliwości wieży i gońca.</li>
                    <li>Ruchy króla – poruszanie się o jedno pole w dowolnym kierunku.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">Taktyki i strategie</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Zaawansowani gracze korzystają z taktyk, takich jak atak podwójny, szpilka czy widełki. Poznanie strategii pozwala na planowanie kilku
                    ruchów do przodu i lepsze reagowanie na zagrożenia.
                  </p>
                  <p className="mt-2">
                    Analiza znanych partii, studiowanie otwarć i ćwiczenia na zestawach treningowych to sposób na rozwój umiejętności strategicznych.
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold">Znani mistrzowie i inspiracje</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Postaci takie jak Garry Kasparov, Bobby Fischer czy Magnus Carlsen stały się ikonami nie tylko świata szachowego, ale i kultury masowej. Ich
                    partie są studiowane przez kolejne pokolenia graczy, a ich podejście do gry inspiruje zarówno amatorów, jak i profesjonalistów.
                  </p>
                </CardContent>
              </Card>
              <div className="text-center">
                <Button variant="outline" onClick={() => window.open("https://www.chess.com", "_blank")}>
                  Dowiedz się więcej na Chess.com
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
