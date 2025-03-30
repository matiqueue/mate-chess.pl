"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

import React, { useEffect, useState, useRef } from "react" // Hooki React do zarządzania stanem i efektami
import styles from "@/styles/landing-page/navbar.module.css" // Style CSS dla nawigacji
import { Fraunces } from "next/font/google" // Font Fraunces z Google Fonts
import { FaMusic } from "react-icons/fa6" // Ikona muzyczna z react-icons
import { usePathname } from "next/navigation" // Hook Next.js do pobierania aktualnej ścieżki URL
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń

// Inicjalizacja fontu Fraunces z podanymi ustawieniami
const fraunces = Fraunces({
  subsets: ["latin"], // Podzbiór znaków łacińskich
  weight: "300", // Waga fontu: 300 (light)
})

/**
 * Navbar
 *
 * Komponent nawigacyjny dla strony głównej aplikacji. Wyświetla logo, nazwę marki
 * i przycisk sterowania muzyką tła. Na urządzeniach mobilnych otwiera rozwijane menu
 * z opcją odtwarzania/pauzowania muzyki. Muzyka działa tylko na stronie głównej ("/").
 *
 * @returns {JSX.Element} Element JSX reprezentujący pasek nawigacyjny.
 *
 * @remarks
 * Komponent używa `Audio` API do odtwarzania muzyki w tle, aktywowanej po pierwszym
 * kliknięciu na stronie (zgodność z polityką przeglądarek). Obsługuje responsywność
 * i dynamicznie zmienia stan w zależności od ścieżki URL.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
const Navbar: React.FC = () => {
  // Hook do tłumaczeń
  const { t } = useTranslation()
  // Stan określający, czy menu mobilne jest otwarte
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Stan określający, czy urządzenie jest mobilne (szerokość <= 768px)
  const [isMobile, setIsMobile] = useState(false)
  // Stan śledzący, czy muzyka jest odtwarzana
  const [isPlaying, setIsPlaying] = useState(false)

  // Referencja do obiektu Audio dla muzyki tła
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Pobieranie aktualnej ścieżki URL
  const pathname = usePathname()

  // Efekt inicjalizujący muzykę i responsywność na stronie głównej
  useEffect(() => {
    // Inicjalizacja tylko na stronie głównej ("/")
    if (pathname === "/") {
      // Tworzenie instancji Audio z plikiem muzycznym
      audioRef.current = new Audio("/audio/bgMusic.mp3")
      audioRef.current.volume = 0.1 // Ustawienie głośności na 10%
      audioRef.current.loop = true // Włączenie zapętlania muzyki

      // Funkcja sprawdzająca szerokość okna i ustawiająca stan mobilności
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768) // Próg 768px dla mobilnych urządzeń
      }

      // Funkcja uruchamiająca muzykę po pierwszym kliknięciu
      const handleFirstClick = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true) // Aktualizacja stanu odtwarzania
            })
            .catch(
              (error) => console.error(t("audioPlaybackError"), error), // Logowanie błędów odtwarzania
            )
        }
      }

      handleResize() // Początkowe sprawdzenie szerokości okna
      window.addEventListener("resize", handleResize) // Podpięcie zdarzenia resize
      document.addEventListener("click", handleFirstClick, { once: true }) // Jednorazowe kliknięcie

      // Czyszczenie zdarzeń i pauza muzyki przy odmontowaniu
      return () => {
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("click", handleFirstClick)
        if (audioRef.current) {
          audioRef.current.pause() // Zatrzymanie muzyki
          setIsPlaying(false) // Reset stanu odtwarzania
        }
      }
    }
  }, [pathname, t]) // Zależności: ścieżka i funkcja tłumaczenia

  // Efekt pauzujący muzykę przy zmianie ścieżki na inną niż "/"
  useEffect(() => {
    if (pathname !== "/" && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause() // Zatrzymanie muzyki
      setIsPlaying(false) // Aktualizacja stanu
    }
  }, [pathname]) // Zależność: zmiana ścieżki

  /**
   * toggleMenu
   *
   * Przełącza stan otwarcia menu mobilnego.
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen) // Zmiana stanu menu
  }

  /**
   * toggleMusic
   *
   * Przełącza odtwarzanie/pauzowanie muzyki tła po kliknięciu w przycisk muzyczny.
   *
   * @param {React.MouseEvent} event - Zdarzenie kliknięcia myszą.
   */
  const toggleMusic = (event: React.MouseEvent) => {
    event.stopPropagation() // Zatrzymanie propagacji zdarzenia
    if (!audioRef.current) return // Wyjście, jeśli audio nie istnieje

    if (audioRef.current.paused) {
      // Odtwarzanie muzyki, jeśli jest zatrzymana
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true) // Aktualizacja stanu na "odtwarzane"
        })
        .catch(
          (error) => console.error(t("audioPlaybackError"), error), // Logowanie błędów
        )
    } else {
      // Pauzowanie muzyki, jeśli jest odtwarzana
      audioRef.current.pause()
      setIsPlaying(false) // Aktualizacja stanu na "zatrzymane"
    }
  }

  // Renderowanie komponentu nawigacyjnego
  return (
    <nav className={styles.navbar}>
      {/* Kontener logo i nazwy marki */}
      <div className={styles.logoContainer}>
        {/* Ikona SVG logo */}
        <svg
          className={styles.logoIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512" // Rozmiar widoku SVG
        >
          <path
            className={styles.svgPath}
            d="M256 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-95.2-8c-18.1 0-31.3 12.8-35.6 26.9c-8 26.2-32.4 45.2-61.2 45.2c-10 0-19.4-2.3-27.7-6.3c-7.6-3.7-16.7-3.3-24 1.2C.7 162.1-3.1 177.1 3.7 188.9L97.6 352l55.4 0-83-144.1c40.5-2.2 75.3-25.9 93.1-59.8c22 26.8 55.4 43.9 92.8 43.9s70.8-17.1 92.8-43.9c17.8 34 52.6 57.7 93.1 59.8L359 352l55.4 0 93.9-163.1c6.8-11.7 3-26.7-8.6-33.8c-7.3-4.5-16.4-4.9-24-1.2c-8.4 4-17.7 6.3-27.7 6.3c-28.8 0-53.2-19-61.2-45.2C382.5 100.8 369.3 88 351.2 88c-14.5 0-26.3 8.5-32.4 19.3c-12.4 22-35.9 36.7-62.8 36.7s-50.4-14.8-62.8-36.7C187.1 96.5 175.4 88 160.8 88zM133.2 432l245.6 0 16.6 32-278.7 0 16.6-32zm283.7-30.7c-5.5-10.6-16.5-17.3-28.4-17.3l-265 0c-12 0-22.9 6.7-28.4 17.3L68.6 452.5c-3 5.8-4.6 12.2-4.6 18.7c0 22.5 18.2 40.8 40.8 40.8l302.5 0c22.5 0 40.8-18.2 40.8-40.8c0-6.5-1.6-12.9-4.6-18.7l-26.5-51.2z"
          />
        </svg>
        {/* Nazwa marki z fontem Fraunces */}
        <span
          className={`${fraunces.className} ${styles.navLogo}`}
          onClick={toggleMenu} // Otwieranie/zamykanie menu po kliknięciu
        >
          {t("navBrandName")} {/* Tłumaczona nazwa marki */}
        </span>
      </div>

      {/* Prawa część nawigacji z przyciskiem muzycznym */}
      <div className={styles.navRight}>
        <div
          className={`${styles.musicButton} ${isPlaying ? styles.musicButtonPlaying : ""}`}
          onClick={toggleMusic} // Obsługa kliknięcia w przycisk muzyczny
        >
          {/* Paski wizualizujące stan odtwarzania */}
          {[...Array(7)].map((_, i) => (
            <span key={i} className={styles.musicStroke}></span>
          ))}
        </div>
      </div>

      {/* Rozwijane menu na urządzeniach mobilnych */}
      {isMobile && isMenuOpen && (
        <ul className={styles.dropdownMenu}>
          <li className={styles.dropdownItem} onClick={toggleMusic}>
            <FaMusic className={styles.dropdownIcon} /> {/* Ikona muzyczna */}
            <span className={fraunces.className}>
              {isPlaying ? t("pauseMusic") : t("playMusic")} {/* Tłumaczony tekst */}
            </span>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar
