// Importy bibliotek i komponentów
import { useState, useEffect } from "react" // Hooki React do stanu i efektów
import { redirect } from "next/navigation" // Funkcja przekierowania z Next.js
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI

/**
 * RedirectCounter
 *
 * Komponent odliczający czas i przekierowujący użytkownika na stronę rejestracji po określonym czasie.
 * Wyświetla licznik sekund i opcjonalny przycisk po zakończeniu odliczania.
 *
 * @returns {JSX.Element} Element JSX reprezentujący licznik i przycisk przekierowania.
 *
 * @remarks
 * Komponent używa hooków useState i useEffect do odliczania czasu oraz automatycznego przekierowania
 * na stronę `/sign-up` z parametrami w URL. Po 5 sekundach następuje przekierowanie, a przycisk
 * появляется tylko po zakończeniu odliczania.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export default function RedirectCounter() {
  const title = "Nie znaleźliśmy twojego konta" // Tytuł komunikatu
  const description = "Załóż konto aby móc korzystać w pełni z naszych usług!" // Opis komunikatu
  const message = "Najpierw utwórz konto!" // Dodatkowa wiadomość

  // Konstruujemy URL z parametrami query
  const query = new URLSearchParams({
    title,
    description,
    message,
  })

  const [seconds, setSeconds] = useState(5) // Stan przechowujący pozostałe sekundy

  // Efekt uruchamiający odliczanie
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 1) {
          clearInterval(interval) // Zatrzymuje interwał, gdy dojdzie do 1
          return 0
        }
        return prev - 1 // Zmniejsza licznik o 1
      })
    }, 1000) // Co 1 sekundę

    return () => clearInterval(interval) // Czyszczenie interwału przy odmontowaniu komponentu
  }, [])

  // Efekt uruchamiający przekierowanie po 5,2 sekundy
  useEffect(() => {
    setTimeout(() => {
      redirect(`/sign-up?${query.toString()}`) // Przekierowanie na stronę rejestracji
    }, 5200)
  }, []) // Puste zależności – uruchamia się raz przy montowaniu

  // Renderowanie licznika i przycisku
  return (
    <>
      {seconds} {/* Wyświetla pozostałe sekundy */}
      {seconds === 0 ? (
        <Button onClick={() => redirect(`/sign-up?${query.toString()}`)}>Przejdź na sign-up</Button> // Przycisk widoczny po zakończeniu odliczania
      ) : (
        ""
      )}
    </>
  )
}
