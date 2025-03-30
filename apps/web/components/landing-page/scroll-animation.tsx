import React from "react" // Import React do definiowania komponentów
import styles from "@/styles/landing-page/scrollAnimation.module.css" // Import stylów CSS dla animacji przewijania

/**
 * ScrollAnimation
 *
 * Komponent renderujący przycisk animacji przewijania na stronie głównej. Służy jako
 * wizualny wskaźnik zachęcający użytkownika do przewinięcia strony w dół. Styl i
 * animacja są zdefiniowane w pliku CSS.
 *
 * @returns {JSX.Element} Element JSX reprezentujący przycisk animacji przewijania.
 *
 * @remarks
 * Komponent jest prosty i opiera się na stylach CSS dla efektu animacji. Nie zawiera
 * logiki interaktywnej w kodzie JS, a jedynie renderuje statyczny element.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
const ScrollAnimation = () => {
  // Renderowanie przycisku z klasą CSS definiującą animację
  return (
    <>
      {/* Przycisk animacji przewijania */}
      <button className={styles.btnScroll}></button>
    </>
  )
}

export default ScrollAnimation // Eksport komponentu do użycia w innych plikach
