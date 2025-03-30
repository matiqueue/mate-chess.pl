import React, { useEffect, useRef, useState } from "react" // Podstawowe hooki React
import * as THREE from "three" // Biblioteka Three.js do grafiki 3D
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js" // Loader modeli GLTF
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js" // Kontrolki orbitalne kamery
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js" // Loader tekstur HDR
import styles from "@/styles/landing-page/chessboard.module.css" // Style CSS dla komponentu
import Button from "@/components/landing-page/button" // Komponent przycisku
import Navbar from "@/components/landing-page/navbar" // Komponent nawigacji
import { Fraunces } from "next/font/google" // Font Fraunces z Google Fonts
import ScrollAnimation from "@/components/landing-page/scroll-animation" // Animacja przewijania
import SkeletonChessboard from "./skeletonChessboard" // Komponent szkieletu ładowania
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń

// Inicjalizacja fontu Fraunces z podanymi ustawieniami
const fraunces = Fraunces({
  subsets: ["latin"], // Podzbiór znaków łacińskich
  weight: "300", // Waga fontu: 300 (light)
})

/**
 * Chessboard
 *
 * Komponent renderujący interaktywną szachownicę 3D na stronie głównej. Używa Three.js
 * do załadowania modelu szachownicy, animacji kamery i oświetlenia sceny. Obsługuje
 * przewijanie, dotyk i klawisze strzałek do zmiany perspektywy kamery oraz dynamiczne
 * wyświetlanie tekstów i przycisku.
 *
 * @returns {JSX.Element} Element JSX reprezentujący szachownicę 3D z interaktywnymi elementami.
 *
 * @remarks
 * Komponent ładuje model GLTF szachownicy, ustawia środowisko HDR i animuje kamerę między
 * predefiniowanymi pozycjami. Wykorzystuje `OrbitControls` z wyłączonymi funkcjami
 * obracania i zoomu dla uproszczenia interakcji.
 * Autor: matiqueue (Szymon Góral), awres (Filip Serwatka)
 * @source Własna implementacja
 */
const Chessboard: React.FC = () => {
  // Referencja do kontenera DOM, w którym renderowana jest scena Three.js
  const mountRef = useRef<HTMLDivElement | null>(null)
  // Stan śledzący aktualny indeks pozycji kamery
  const [currentIndex, setCurrentIndex] = useState(0)
  // Stała pozycja końcowa dla wyświetlenia przycisku
  const [lastPosition] = useState(5)
  // Stan wskazujący, czy model szachownicy został załadowany
  const [modelLoaded, setModelLoaded] = useState(false)
  // Stan śledzący postęp ładowania modelu
  const [loadingProgress, setLoadingProgress] = useState(0)
  // Hook do tłumaczeń
  const { t } = useTranslation()

  // Symulacja ładowania modelu z postępem
  useEffect(() => {
    let current = 0 // Licznik postępu
    const intervalId = setInterval(() => {
      if (current < 100) {
        current++ // Zwiększanie postępu o 1
        setLoadingProgress(current) // Aktualizacja stanu postępu
      } else {
        clearInterval(intervalId) // Zatrzymanie interwału po osiągnięciu 100%
        setModelLoaded(true) // Oznaczenie modelu jako załadowanego
      }
    }, 65) // Interwał 65ms dla płynnego efektu
    return () => clearInterval(intervalId) // Czyszczenie interwału przy odmontowaniu
  }, [])

  // Stan kontrolujący widoczność przycisku
  const [showButton, setShowButton] = useState(false)
  // Referencja do tablicy pozycji kamery i punktów patrzenia
  const cameraPositions = useRef<{ position: THREE.Vector3; lookAt: THREE.Vector3 }[]>([
    { position: new THREE.Vector3(0, 8, 8), lookAt: new THREE.Vector3(0, 0, 0) }, // Widok z przodu
    { position: new THREE.Vector3(0, 10, 0), lookAt: new THREE.Vector3(0, 0, 0) }, // Widok z góry
    { position: new THREE.Vector3(0, 8, 10), lookAt: new THREE.Vector3(0, 0, 0) }, // Powrót do widoku z przodu
    { position: new THREE.Vector3(-8, 3, 0), lookAt: new THREE.Vector3(0, 0, 0) }, // Widok z boku
    { position: new THREE.Vector3(-2, 3, 0), lookAt: new THREE.Vector3(0, 0, 0) }, // Przybliżenie
    { position: new THREE.Vector3(-8, 3, 0), lookAt: new THREE.Vector3(0, 0, 0) }, // Widok oddalony
  ])
  // Referencja do aktualnego indeksu pozycji kamery
  const currentPositionIndex = useRef(0)
  // Flaga wskazująca, czy trwa animacja przejścia
  const transitioning = useRef(false)
  // Czas rozpoczęcia animacji przejścia
  const startTransitionTime = useRef<number | null>(null)
  // Czas trwania animacji w milisekundach (3 sekundy)
  const animationDuration = 3000
  // Początkowa pozycja kamery dla animacji
  const startPosition = useRef(new THREE.Vector3())
  // Docelowa pozycja kamery dla animacji
  const targetPosition = useRef(new THREE.Vector3())
  // Początkowa rotacja szachownicy
  const startRotation = useRef(0)
  // Docelowa rotacja szachownicy
  const targetRotation = useRef(0)
  // Referencja do modelu szachownicy
  const chessModel = useRef<THREE.Group | null>(null)
  // Referencja do kamery Three.js
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  // Tablica tekstów wyświetlanych w zależności od pozycji kamery
  const [textTab] = useState([
    { title: t("textTab.mateChess.title"), description: t("textTab.mateChess.description") },
    { title: t("textTab.birdEye.title"), description: t("textTab.birdEye.description") },
    { title: t("textTab.analyzeFrontline.title"), description: t("textTab.analyzeFrontline.description") },
    { title: t("textTab.opponentPerspective.title"), description: t("textTab.opponentPerspective.description") },
    { title: t("textTab.criticalChessInsights.title"), description: t("textTab.criticalChessInsights.description") },
  ])

  /**
   * handleDotClick
   *
   * Obsługuje kliknięcie w kropkę nawigacyjną, zmieniając pozycję kamery i rotację szachownicy.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - Zdarzenie kliknięcia myszą.
   */
  const handleDotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.getAttribute("data-index")) // Pobranie indeksu z atrybutu
    if (index === currentPositionIndex.current || transitioning.current || !cameraRef.current) return

    const newPosition = cameraPositions.current[index]
    if (!newPosition) return

    startPosition.current.copy(cameraRef.current.position) // Zachowanie startowej pozycji
    targetPosition.current.copy(newPosition.position) // Ustawienie docelowej pozycji

    // Ustawienia rotacji szachownicy
    startRotation.current = chessModel.current?.rotation.y || 0
    if (index === 3) {
      targetRotation.current = startRotation.current + Math.PI / 2 // Obrót o 90° dla widoku bocznego
    } else if (index === 2) {
      targetRotation.current = 0 // Reset rotacji
    } else {
      targetRotation.current = startRotation.current // Brak zmiany rotacji
    }

    // Aktualizacja indeksu i stanu
    currentPositionIndex.current = index
    setCurrentIndex(index)
    transitioning.current = true
    startTransitionTime.current = performance.now()

    // Wyświetlanie przycisku na ostatniej pozycji
    setShowButton(index === lastPosition)
  }

  /**
   * handleDotTouch
   *
   * Obsługuje dotyk na kropce nawigacyjnej (dla urządzeń mobilnych), zmieniając pozycję kamery.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - Zdarzenie dotyku.
   */
  const handleDotTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation() // Zatrzymanie propagacji zdarzenia

    const index = Number(e.currentTarget.getAttribute("data-index"))
    if (index === currentPositionIndex.current || transitioning.current || !cameraRef.current) return

    const newPosition = cameraPositions.current[index]
    if (!newPosition) return

    startPosition.current.copy(cameraRef.current.position)
    targetPosition.current.copy(newPosition.position)

    // Ustawienia rotacji szachownicy
    startRotation.current = chessModel.current?.rotation.y || 0
    if (index === 3) {
      targetRotation.current = startRotation.current + Math.PI / 2
    } else if (index === 2) {
      targetRotation.current = 0
    } else {
      targetRotation.current = startRotation.current
    }

    currentPositionIndex.current = index
    setCurrentIndex(index)
    transitioning.current = true
    startTransitionTime.current = performance.now()

    setShowButton(index === lastPosition)
  }

  /**
   * renderButton
   *
   * Renderuje komponent Button, jeśli showButton jest prawdziwe.
   *
   * @returns {JSX.Element | null} Element przycisku lub null.
   */
  const renderButton = () => {
    if (showButton) {
      return <Button /> // Wyświetl przycisk na ostatniej pozycji
    }
    return null
  }

  /**
   * RenderText
   *
   * Renderuje dynamiczny tekst w zależności od aktualnej pozycji kamery.
   *
   * @returns {JSX.Element | null} Element tekstowy lub null.
   */
  const RenderText = () => {
    const currentText = textTab[currentPositionIndex.current] // Pobranie bieżącego tekstu
    if (!currentText) return null

    const topPosition = 20 + currentPositionIndex.current * 10 // Dynamiczna pozycja tekstu

    return (
      <div
        key={currentPositionIndex.current} // Klucz dla re-renderowania
        className={`${styles.textContainer} ${currentPositionIndex.current % 2 === 0 ? styles.textLeft : styles.textRight} ${styles.animateText}`}
        style={{ top: `${topPosition}%` }} // Ustawienie pozycji pionowej
      >
        <h1 className={`${fraunces.className} ${styles.textTitle}`}>{currentText.title}</h1>
        <p className={`${fraunces.className} ${styles.textDescription}`}>{currentText.description}</p>
      </div>
    )
  }

  // Główny efekt konfigurujący scenę Three.js
  useEffect(() => {
    console.log("Chessboard mounted")
    if (!mountRef.current) {
      console.error("mountRef.current jest null!") // Log błędu, jeśli kontener nie istnieje
      return
    }

    // Inicjalizacja sceny
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera

    // Ustawienie początkowej pozycji kamery
    if (cameraPositions.current[0]) {
      camera.position.copy(cameraPositions.current[0].position)
      camera.lookAt(cameraPositions.current[0].lookAt)
    }

    // Inicjalizacja renderera
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.top = "0"
    renderer.domElement.style.left = "0"
    renderer.domElement.style.width = "100vw"
    renderer.domElement.style.height = "100vh"
    renderer.domElement.style.margin = "0"
    renderer.domElement.style.padding = "0"
    renderer.domElement.style.overflow = "hidden"
    renderer.shadowMap.enabled = true
    mountRef.current.appendChild(renderer.domElement)

    // Obsługa zmiany rozmiaru okna
    const handleResize = () => {
      if (mountRef.current && cameraRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
        renderer.render(scene, cameraRef.current) // Ponowne renderowanie po zmianie rozmiaru
      }
    }
    window.addEventListener("resize", handleResize)

    // Ładowanie tła HDR
    const textureLoader = new RGBELoader()
    textureLoader.load("/backgrounds/finalBackground.hdr", (texture: THREE.Texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      const backgroundGeometry = new THREE.SphereGeometry(500, 32, 32)
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      })
      const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
      scene.add(backgroundMesh)
      scene.environment = texture // Ustawienie tekstury jako środowiska sceny
    })

    // Ustawienie kontrolek orbitalnych
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableRotate = false // Wyłączenie rotacji
    controls.enablePan = false // Wyłączenie przesuwania
    controls.enableZoom = false // Wyłączenie zoomu

    // Dodanie świateł do sceny
    const ambientLight = new THREE.AmbientLight(0x808080, 0.7) // Światło otoczenia
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 2.0, 150) // Światło punktowe
    pointLight.position.set(0, 20, 10)
    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 2048
    pointLight.shadow.mapSize.height = 2048
    scene.add(pointLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0) // Światło kierunkowe
    directionalLight.position.set(10, 20, 15)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Ładowanie modelu szachownicy
    const loaderGLTF = new GLTFLoader()
    loaderGLTF.load(
      "/models/landing-page/landing-chessboard.glb",
      (gltf) => {
        const model = gltf.scene
        const updateModelScale = () => {
          const isMobile = window.innerWidth < 768
          const scaleFactor = isMobile ? 6 : 11 // Skala zależna od urządzenia
          model.scale.set(scaleFactor, scaleFactor, scaleFactor)
        }
        updateModelScale()
        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true // Włączenie cieni
          }
        })
        chessModel.current = model
        scene.add(model)
        window.addEventListener("resize", updateModelScale) // Aktualizacja skali przy resize
      },
      undefined,
      (error) => {
        console.error("Błąd ładowania modelu:", error) // Log błędu ładowania
      },
    )

    /**
     * handleScroll
     *
     * Obsługuje przewijanie strony, zmieniając pozycję kamery i rotację szachownicy.
     *
     * @param {WheelEvent} event - Zdarzenie przewijania.
     */
    const handleScroll = (event: WheelEvent) => {
      if (currentPositionIndex.current === lastPosition) {
        setShowButton(true)
      } else if (!transitioning.current && cameraPositions.current.length) {
        const direction = event.deltaY > 0 ? 1 : -1
        const newIndex = (currentPositionIndex.current + direction + cameraPositions.current.length) % cameraPositions.current.length
        const newPosition = cameraPositions.current[newIndex]
        if (!newPosition) return

        startPosition.current.copy(camera.position)
        targetPosition.current.copy(newPosition.position)
        startRotation.current = chessModel.current?.rotation.y || 0
        if (newIndex === 3) {
          targetRotation.current = startRotation.current + Math.PI / 4
        } else if (newIndex === 2) {
          targetRotation.current = 0
        } else {
          targetRotation.current = startRotation.current
        }
        currentPositionIndex.current = newIndex
        setCurrentIndex(newIndex)
        transitioning.current = true
        startTransitionTime.current = performance.now()
        setShowButton(newIndex === lastPosition)
      }
    }

    // Obsługa zdarzeń dotykowych
    let touchStartY = 0
    let touchEndY = 0
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        touchEndY = event.touches[0].clientY
      }
    }
    const handleTouchEnd = () => {
      if (transitioning.current || !cameraPositions.current.length || !cameraRef.current) return
      const deltaY = touchStartY - touchEndY
      const direction = deltaY > 0 ? 1 : -1
      const newIndex = (currentPositionIndex.current + direction + cameraPositions.current.length) % cameraPositions.current.length
      const newPosition = cameraPositions.current[newIndex]
      if (!newPosition) return

      startPosition.current.copy(cameraRef.current!.position)
      targetPosition.current.copy(newPosition.position)
      startRotation.current = chessModel.current?.rotation.y || 0
      if (newIndex === 3) {
        targetRotation.current = startRotation.current + Math.PI / 4
      } else if (newIndex === 2) {
        targetRotation.current = 0
      } else {
        targetRotation.current = startRotation.current
      }
      currentPositionIndex.current = newIndex
      setCurrentIndex(newIndex)
      transitioning.current = true
      startTransitionTime.current = performance.now()
      setShowButton(newIndex === lastPosition)
    }

    /**
     * handleKeyDown
     *
     * Obsługuje klawisze strzałek (góra/dół) do zmiany pozycji kamery.
     *
     * @param {KeyboardEvent} event - Zdarzenie klawiatury.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (transitioning.current || !cameraRef.current) return
      let direction = 0
      if (event.key === "ArrowDown") {
        direction = 1
      } else if (event.key === "ArrowUp") {
        direction = -1
      }
      if (direction === 0) return

      const newIndex = (currentPositionIndex.current + direction + cameraPositions.current.length) % cameraPositions.current.length
      const newPosition = cameraPositions.current[newIndex]
      if (!newPosition) return

      startPosition.current.copy(cameraRef.current.position)
      targetPosition.current.copy(newPosition.position)
      startRotation.current = chessModel.current?.rotation.y || 0
      if (newIndex === 3) {
        targetRotation.current = startRotation.current + Math.PI / 4
      } else if (newIndex === 2) {
        targetRotation.current = 0
      } else {
        targetRotation.current = startRotation.current
      }
      currentPositionIndex.current = newIndex
      setCurrentIndex(newIndex)
      transitioning.current = true
      startTransitionTime.current = performance.now()
      setShowButton(newIndex === lastPosition)
    }

    // Podpięcie zdarzeń
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
    window.addEventListener("wheel", handleScroll)
    window.addEventListener("keydown", handleKeyDown)

    // Funkcja animacji
    const animate = () => {
      requestAnimationFrame(animate)
      if (transitioning.current && startTransitionTime.current !== null) {
        const elapsedTime = performance.now() - startTransitionTime.current
        const rawProgress = Math.min(elapsedTime / animationDuration, 1)
        const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
        const progress = easeInOutQuad(rawProgress)

        // Płynna interpolacja pozycji kamery
        camera.position.lerpVectors(startPosition.current, targetPosition.current, progress)

        // Rotacja szachownicy
        if (chessModel.current) {
          chessModel.current.rotation.y = startRotation.current + (targetRotation.current - startRotation.current) * progress
        }

        const currentLookAt = cameraPositions.current[currentPositionIndex.current]?.lookAt
        if (currentLookAt) camera.lookAt(currentLookAt)

        if (rawProgress === 1) {
          transitioning.current = false
          startTransitionTime.current = null // Reset animacji
        }
      }
      controls.update()
      renderer.render(scene, camera) // Renderowanie sceny
    }
    animate()

    // Czyszczenie przy odmontowaniu
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("wheel", handleScroll)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("keydown", handleKeyDown)
      mountRef.current?.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPosition])

  // Renderowanie komponentu
  return (
    <div className="mainContainer">
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        {/* Kontener Three.js */}
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
        {/* Overlay ładowania */}
        {!modelLoaded && <SkeletonChessboard progress={loadingProgress} />}
      </div>
      {modelLoaded && <Navbar />}
      {modelLoaded && RenderText()}
      {modelLoaded && renderButton()}
      {modelLoaded && (
        <div className={styles.dotsContainer}>
          {cameraPositions.current.map((_, index) => (
            <div
              onClick={handleDotClick}
              onTouchStart={handleDotTouch}
              data-index={index}
              key={index}
              className={`${styles.dot} ${currentIndex === index ? styles.dotActive : ""}`}
            ></div>
          ))}
        </div>
      )}
      <div className={styles.scrollContainer}>{modelLoaded && <ScrollAnimation />}</div>
    </div>
  )
}

export default Chessboard
