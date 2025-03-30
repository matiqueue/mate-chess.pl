import * as THREE from "three" // Import całej biblioteki Three.js do obsługi grafiki 3D

/**
 * CameraScrollComponent
 *
 * Komponent zarządzający kamerą w scenie 3D przy użyciu Three.js. Odpowiada za płynne
 * przesuwanie kamery między predefiniowanymi pozycjami w zależności od przewijania
 * strony przez użytkownika. Kamera zawsze patrzy na punkt centralny (0, 0, 0).
 *
 * @param {THREE.PerspectiveCamera} camera - Kamera perspektywy Three.js do manipulacji.
 * @returns {THREE.PerspectiveCamera} Skonfigurowana kamera z obsługą scrolla i animacji.
 *
 * @remarks
 * Komponent definiuje zestaw pozycji docelowych dla kamery i płynnie interpoluje między nimi
 * za pomocą metody `lerp`. Wykorzystuje zdarzenie przewijania (`wheel`) do zmiany sekcji
 * oraz `requestAnimationFrame` do ciągłej animacji kamery.
 * Autor: matiqueue (Szymon Góral), Wojciech Piątek
 * @source Własna implementacja
 */
const CameraScrollComponent = (camera: THREE.PerspectiveCamera): THREE.PerspectiveCamera => {
  // Tablica pozycji docelowych kamery dla różnych sekcji scrolla
  const positions: THREE.Vector3[] = [
    new THREE.Vector3(6, 10, 15), // Początkowa pozycja kamery (daleko od centrum)
    new THREE.Vector3(6, 8, 12), // Pozycja po pierwszym przewinięciu (nieco bliżej)
    new THREE.Vector3(6, 6, 9), // Pozycja po drugim przewinięciu (jeszcze bliżej)
    new THREE.Vector3(6, 4, 6), // Najbliższa pozycja kamery względem centrum
  ]

  // Zmienna śledząca aktualną sekcję scrolla (indeks w tablicy positions)
  let currentSection = 0

  /**
   * handleScroll
   *
   * Funkcja obsługująca zdarzenie przewijania strony. Zmienia bieżącą sekcję
   * na podstawie kierunku przewijania (w dół lub w górę), ograniczając indeks
   * do zakresu dostępnych pozycji.
   *
   * @param {WheelEvent} event - Zdarzenie przewijania generowane przez kółko myszy.
   */
  const handleScroll = (event: WheelEvent) => {
    // Określenie kierunku przewijania: 1 (w dół) lub -1 (w górę)
    const delta = event.deltaY > 0 ? 1 : -1
    // Ograniczenie wartości currentSection do zakresu [0, positions.length - 1]
    currentSection = THREE.MathUtils.clamp(
      currentSection + delta, // Aktualizacja sekcji na podstawie przewijania
      0, // Minimalna wartość indeksu
      positions.length - 1, // Maksymalna wartość indeksu
    )
  }

  // Podpięcie zdarzenia przewijania do okna przeglądarki
  window.addEventListener("wheel", handleScroll)

  /**
   * animateCamera
   *
   * Funkcja animująca ruch kamery w stronę docelowej pozycji dla bieżącej sekcji.
   * Wykorzystuje metodę `lerp` dla płynnego przejścia i ustawia punkt patrzenia kamery
   * na środek sceny (0, 0, 0). Wywołuje się rekurencyjnie za pomocą `requestAnimationFrame`.
   */
  const animateCamera = () => {
    // Pobranie docelowej pozycji kamery na podstawie bieżącej sekcji
    const targetPosition = positions[currentSection]
    if (targetPosition) {
      // Płynne przejście pozycji kamery do celu z szybkością 0.1
      camera.position.lerp(targetPosition, 0.1)
    }
    // Ustawienie kamery tak, aby zawsze patrzyła na centrum sceny (0, 0, 0)
    camera.lookAt(0, 0, 0)
    // Rekurencyjne wywołanie animacji w kolejnej klatce
    requestAnimationFrame(animateCamera)
  }

  // Rozpoczęcie pętli animacyjnej kamery
  animateCamera()

  // Zwrócenie skonfigurowanej kamery
  return camera
}

export default CameraScrollComponent
