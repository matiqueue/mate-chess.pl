"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { CheckCircle, XCircle } from "lucide-react"

type Quiz = {
  id: number
  question: string
  options: {
    id: string
    text: string
  }[]
  correctAnswer: string
}

export function QuizClient({ quizzes }: { quizzes: Quiz[] }) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const currentQuiz: any = quizzes[currentQuizIndex]
  const isAnswered = answeredQuestions.includes(currentQuiz.id)
  const isCorrect = selectedAnswer === currentQuiz.correctAnswer

  const handleAnswerSelect = (value: string) => {
    if (isAnswered) return
    setSelectedAnswer(value)
  }

  const handleShowAnswer = () => {
    if (!selectedAnswer || isAnswered) return

    setShowAnswer(true)
    setAnsweredQuestions([...answeredQuestions, currentQuiz.id])

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          Question {currentQuizIndex + 1} of {quizzes.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score}/{answeredQuestions.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuiz.id}</CardTitle>
          <CardDescription>{currentQuiz.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelect}>
            {currentQuiz.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  showAnswer && option.id === currentQuiz.correctAnswer
                    ? "bg-green-100 dark:bg-green-900/20"
                    : showAnswer && option.id === selectedAnswer
                      ? "bg-red-100 dark:bg-red-900/20"
                      : "hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value={option.id} id={`q${currentQuiz.id}-${option.id}`} disabled={isAnswered} />
                <Label htmlFor={`q${currentQuiz.id}-${option.id}`} className="flex-1 cursor-pointer flex items-center justify-between">
                  <span>
                    {option.id.toUpperCase()}. {option.text}
                  </span>
                  {showAnswer && option.id === currentQuiz.correctAnswer && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {showAnswer && option.id === selectedAnswer && option.id !== currentQuiz.correctAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showAnswer && (
            <div className="mt-4 p-3 rounded-md bg-muted">
              <p className="font-medium">{isCorrect ? "Correct! 🎉" : "Incorrect! 😕"}</p>
              <p className="text-sm text-muted-foreground mt-1">
                The correct answer is: {currentQuiz.correctAnswer.toUpperCase()}. {currentQuiz.options.find((o) => o.id === currentQuiz.correctAnswer)?.text}
              </p>
            </div>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuizIndex === 0}>
              Previous
            </Button>
            <Button variant="outline" onClick={handleShowAnswer} disabled={!selectedAnswer || isAnswered}>
              Check Answer
            </Button>
          </div>
          <Button onClick={handleNextQuestion} disabled={currentQuizIndex === quizzes.length - 1}>
            Next Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
