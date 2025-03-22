"use client"

import { useEffect } from "react"
import { useErrorReporter } from "@/contexts/ErrorContextProvider" // Poprawna ścieżka dla web

/**
 * Komponent Error
 *
 * Renderuje widok błędu dla aplikacji web i raportuje go przy użyciu kontekstu błędów.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {Error & { digest?: string }} props.error - Obiekt błędu z opcjonalnym polem digest.
 * @param {() => void} props.reset - Funkcja resetująca, wywoływana przy próbie ponownego renderowania błędu.
 * @returns {JSX.Element} Element JSX wyświetlający komunikat błędu oraz przycisk reset.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }): JSX.Element {
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
