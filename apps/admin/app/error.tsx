"use client"

import { useEffect } from "react"
import { useErrorReporter } from "@/context/ErrorContextProvider"

/**
 * Komponent Error
 *
 * Renderuje widok błędu w panelu admina. Raportuje błąd przy użyciu hooka useEffect.
 *
 * @param {object} props - Właściwości komponentu.
 * @param {Error & { digest?: string }} props.error - Obiekt błędu z opcjonalnym polem digest.
 * @param {() => void} props.reset - Funkcja resetująca, wywoływana przy próbie ponownego renderowania błędu.
 * @returns {JSX.Element} Widok błędu.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Pobiera funkcję raportowania błędów z kontekstu.
  const reportError = useErrorReporter()

  useEffect(() => {
    // Przygotowuje dane błędu do raportowania.
    const errorData = {
      type: "error", // Typ błędu
      app: "admin", // Aplikacja, w której wystąpił błąd
      filePath: error.stack?.split("\n")[1] || "nieznana ścieżka", // Ścieżka z błędem
      message: error.message, // Komunikat błędu
      stack: error.stack, // Stos błędu
      digest: error.digest, // Opcjonalny skrót błędu
      timestamp: new Date().toISOString(), // Znacznik czasu
    }
    reportError(errorData)
    console.log("Błąd hydratacji zgłoszony w admin:", errorData)
  }, [error, reportError])

  return (
    <div>
      <h2>Wystąpił poważny błąd w panelu admina!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Spróbuj ponownie</button>
    </div>
  )
}
