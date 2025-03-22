export interface QuizProgress {
  currentQuizIndex: number
  score: number
  quizCompleted: boolean
}

const STORAGE_KEY = "quizProgress"

export function loadQuizProgress(): QuizProgress | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as QuizProgress
  } catch (error) {
    console.error("Błąd odczytu postępu quizu z localStorage", error)
    return null
  }
}

export function saveQuizProgress(progress: QuizProgress) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error("Błąd zapisu postępu quizu do localStorage", error)
  }
}

export function resetQuizProgress() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
