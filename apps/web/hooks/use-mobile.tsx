import * as React from "react" // Import React z wszystkimi eksportami dla hooków i typów

/**
 * Stała definiująca punkt graniczny dla widoku mobilnego w pikselach.
 */
const MOBILE_BREAKPOINT = 768 // Próg szerokości ekranu dla urządzeń mobilnych

/**
 * useIsMobile
 *
 * Niestandardowy hook React zwracający wartość logiczną wskazującą, czy bieżąca szerokość
 * ekranu jest mniejsza niż zdefiniowany punkt graniczny dla widoku mobilnego. Używa
 * `matchMedia` do monitorowania zmian rozmiaru okna.
 *
 * @returns {boolean} Wartość `true`, jeśli ekran jest w trybie mobilnym, `false` w przeciwnym razie.
 *
 * @remarks
 * Hook ustala początkowy stan na podstawie szerokości okna i nasłuchuje zmian rozmiaru
 * za pomocą `MediaQueryList`. Wartość `undefined` jest zwracana tylko przed pierwszym
 * renderowaniem po stronie klienta.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function useIsMobile(): boolean {
  // Stan przechowujący informację, czy ekran jest w trybie mobilnym (undefined przed zamontowaniem)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Efekt monitorujący szerokość ekranu i aktualizujący stan
  React.useEffect(() => {
    // Tworzenie zapytania media dla maksymalnej szerokości poniżej progu mobilnego
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Funkcja obsługująca zmianę szerokości ekranu
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) // Aktualizacja stanu na podstawie szerokości
    }

    // Dodanie nasłuchiwania na zmiany w zapytaniu media
    mql.addEventListener("change", onChange)

    // Ustawienie początkowego stanu na podstawie bieżącej szerokości ekranu
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Czyszczenie nasłuchiwania przy odmontowaniu komponentu
    return () => mql.removeEventListener("change", onChange)
  }, []) // Puste zależności - efekt uruchamia się raz po zamontowaniu

  // Zwrócenie wartości logicznej (konwersja undefined na false przed pierwszym renderem)
  return !!isMobile
}
