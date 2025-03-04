// apps/web/app/error.tsx
"use client"

import { useEffect } from "react"
import { useErrorReporter } from "@/contexts/ErrorContextProvider" // Poprawna ścieżka dla web

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const reportError = useErrorReporter()

  useEffect(() => {
    const errorData = {
      type: "error",
      app: "web",
      filePath: error.stack?.split("\n")[1] || "nieznana ścieżka",
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    }
    reportError(errorData)
    console.log("Błąd hydratacji zgłoszony:", errorData)
  }, [error, reportError])

  return (
    <div>
      <h2>Wystąpił poważny błąd!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Spróbuj ponownie</button>
    </div>
  )
}
