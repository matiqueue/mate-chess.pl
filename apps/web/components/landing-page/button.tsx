import { gsap } from "gsap" // Biblioteka GSAP do animacji
import { useRef } from "react" // Hook React do zarządzania referencjami DOM
import styles from "@/styles/landing-page/button.module.css" // Import stylów CSS dla przycisku
import { useRouter } from "next/navigation" // Hook Next.js do nawigacji między stronami
import { Smooch_Sans } from "next/font/google" // Import fontu Smooch Sans z Google Fonts
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń

// Inicjalizacja fontu Smooch Sans z podanymi ustawieniami
const smooch_sans = Smooch_Sans({
  subsets: ["latin"], // Podzbiór znaków łacińskich
  weight: ["600", "700"], // Wagi fontu: 600 (semi-bold) i 700 (bold)
})

/**
 * Button
 *
 * Komponent przycisku z animacją GSAP, który po kliknięciu wykonuje efekt przejścia
 * i przenosi użytkownika na stronę główną aplikacji (/home). Używa gradientów i poświaty
 * do stworzenia dynamicznego efektu wizualnego.
 *
 * @returns {JSX.Element} Element JSX reprezentujący animowany przycisk.
 *
 * @remarks
 * Komponent wykorzystuje bibliotekę GSAP do płynnych animacji, zmieniając tło, cień,
 * rozmiar i pozycję przycisku. Po zakończeniu animacji następuje przekierowanie.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
const Button = () => {
  // Referencja do elementu DOM przycisku
  const buttonRef = useRef<HTMLDivElement>(null)
  // Hook nawigacji Next.js
  const router = useRouter()
  // Hook do tłumaczeń
  const { t } = useTranslation()

  /**
   * handleClick
   *
   * Funkcja obsługująca kliknięcie przycisku. Tworzy i uruchamia animację GSAP,
   * która modyfikuje wygląd przycisku w kilku krokach, a następnie przekierowuje
   * użytkownika na stronę /home.
   *
   * @remarks
   * Animacja składa się z kilku etapów zmieniających opacity, tło, cień, rozmiar i pozycję.
   * Po zakończeniu animacji następuje nawigacja.
   */
  const handleClick = () => {
    // Tworzenie osi czasu animacji GSAP
    const timeLine = gsap.timeline({
      paused: false, // Animacja uruchamia się od razu
    })

    // Sekwencja animacji
    timeLine
      // Etap 1: Lekkie przyciemnienie i zmiana tła na gradient
      .to(buttonRef.current, {
        duration: 0.6, // Czas trwania: 0.6 sekundy
        opacity: 0.9, // Lekkie przyciemnienie
        background: "linear-gradient(90deg, #c0c0c0, #000)", // Gradient srebrno-czarny
        boxShadow: "0px 0px 20px 5px rgba(192, 192, 192, 0.8)", // Srebrna poświata
      })
      // Etap 2: Zmniejszenie wysokości i wzmocnienie efektu cienia
      .to(buttonRef.current, {
        duration: 0.8, // Czas trwania: 0.8 sekundy
        height: 0.2, // Zmniejszenie wysokości do minimalnej wartości
        opacity: 0.8, // Dalsze przyciemnienie
        background: "linear-gradient(90deg, #c0c0c0, #000)", // Utrzymanie gradientu
        boxShadow: "0px 0px 30px 10px rgba(192, 192, 192, 0.9)", // Silniejszy cień
        fontSize: 0, // Ukrycie tekstu
        delay: 0.25, // Opóźnienie: 0.25 sekundy
      })
      // Etap 3: Przejście na czarne tło
      .to(buttonRef.current, {
        duration: 0.1, // Krótki czas trwania: 0.1 sekundy
        opacity: 1, // Pełna widoczność
        background: "#000", // Czarne tło
      })
      // Etap 4: Zmiana szerokości na minimalną
      .to(buttonRef.current, 0, {
        width: 2, // Minimalna szerokość
        delay: 0.2, // Opóźnienie: 0.2 sekundy
      })
      // Etap 5: Wzrost wysokości i przesunięcie w górę
      .to(buttonRef.current, 0.1, {
        boxShadow: "0px 0px 50px 25px rgba(192, 192, 192, 0.7)", // Mocniejsza poświata
        y: 90, // Przesunięcie w pionie
        height: 100, // Zwiększenie wysokości
        delay: 0.23, // Opóźnienie: 0.23 sekundy
      })
      // Etap 6: Rozrost kreski i efekt końcowy
      .to(buttonRef.current, 0.3, {
        height: 1000, // Kreska rośnie na ekranie
        y: -1500, // Unosi się poza ekran
        boxShadow: "0px 0px 75px 25px rgba(192, 192, 192, 0.6)", // Subtelna poświata
        background: "linear-gradient(90deg, #000, #c0c0c0)", // Gradient powrotny
        delay: 0.2, // Opóźnienie: 0.2 sekundy
      })
      // Po zakończeniu animacji: przekierowanie na stronę /home
      .then(() => {
        router.push("/home")
      })
  }

  // Renderowanie przycisku z referencją i stylami
  return (
    <div
      ref={buttonRef} // Podpięcie referencji do elementu DOM
      onClick={handleClick} // Obsługa kliknięcia
      className={styles.button} // Zastosowanie stylów z pliku CSS
    >
      {/* Tekst przycisku z tłumaczeniem i fontem Smooch Sans */}
      <p className={`${smooch_sans.className} button-text`}>{t("btnPlayMateChess")}</p>
    </div>
  )
}

export default Button
