import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import styles from "@/styles/landing-page/chessboard.module.css"
import Button from "@/components/landing-page/button"
import Navbar from "@/components/landing-page/navbar"
import { Fraunces } from "next/font/google"
import ScrollAnimation from "@/components/landing-page/scroll-animation"
import SkeletonChessboard from "./skeletonChessboard"
import { useTranslation } from "react-i18next";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "300",
})

const Chessboard: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0) // Aktualny indeks pozycji kamery
  const [lastPosition] = useState(5)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const { t } = useTranslation();

  useEffect(() => {
    let current = 0
    const intervalId = setInterval(() => {
      if (current < 100) {
        current++
        setLoadingProgress(current)
      } else {
        clearInterval(intervalId)
        setModelLoaded(true)
      }
    }, 65)
    return () => clearInterval(intervalId)
  }, [])

  const [showButton, setShowButton] = useState(false)
  const cameraPositions = useRef<{ position: THREE.Vector3; lookAt: THREE.Vector3 }[]>([
    {
      position: new THREE.Vector3(0, 8, 8), // Widok z przodu
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      position: new THREE.Vector3(0, 10, 0), // Widok z góry
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      position: new THREE.Vector3(0, 8, 10), // Powrót do widoku z przodu
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      position: new THREE.Vector3(-8, 3, 0), // Widok z boku
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      position: new THREE.Vector3(-2, 3, 0), // Przybliżenie do szachownicy
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      position: new THREE.Vector3(-8, 3, 0), // Widok oddalony
      lookAt: new THREE.Vector3(0, 0, 0),
    },
  ])
  const currentPositionIndex = useRef(0)
  const transitioning = useRef(false)
  const startTransitionTime = useRef<number | null>(null)
  const animationDuration = 3000 // 3 sekundy
  const startPosition = useRef(new THREE.Vector3())
  const targetPosition = useRef(new THREE.Vector3())
  const startRotation = useRef(0) // Startowa rotacja szachownicy
  const targetRotation = useRef(0) // Docelowa rotacja szachownicy
  const chessModel = useRef<THREE.Group | null>(null) // Referencja do modelu szachownicy
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  const [textTab] = useState([
    {
      title: t("textTab.mateChess.title"),
      description: t("textTab.mateChess.description"),
    },
    {
      title: t("textTab.birdEye.title"),
      description: t("textTab.birdEye.description"),
    },
    {
      title: t("textTab.analyzeFrontline.title"),
      description: t("textTab.analyzeFrontline.description"),
    },
    {
      title: t("textTab.opponentPerspective.title"),
      description: t("textTab.opponentPerspective.description"),
    },
    {
      title: t("textTab.criticalChessInsights.title"),
      description: t("textTab.criticalChessInsights.description"),
    },
  ]);

  const handleDotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.getAttribute("data-index"))
    if (index === currentPositionIndex.current || transitioning.current || !cameraRef.current) return

    const newPosition = cameraPositions.current[index]
    if (!newPosition) return

    startPosition.current.copy(cameraRef.current.position)
    targetPosition.current.copy(newPosition.position)

    // Ustawienia rotacji szachownicy
    startRotation.current = chessModel.current?.rotation.y || 0
    if (index === 3) {
      // Obrót szachownicy o 90 stopni dla widoku z boku
      targetRotation.current = startRotation.current + Math.PI / 2
    } else if (index === 2) {
      // Cofnij obrót do pierwotnej rotacji
      targetRotation.current = 0
    } else {
      targetRotation.current = startRotation.current // Nie obracaj w innych przypadkach
    }

    // Aktualizacja indeksu i stanu
    currentPositionIndex.current = index
    setCurrentIndex(index)
    transitioning.current = true
    startTransitionTime.current = performance.now()

    // Wyświetl przycisk, jeśli dotyczy ostatniej pozycji
    if (index === lastPosition) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }

  const handleDotTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation() // Zatrzymaj propagację, aby globalne touch eventy nie reagowały

    const index = Number(e.currentTarget.getAttribute("data-index"))
    if (index === currentPositionIndex.current || transitioning.current || !cameraRef.current) return

    const newPosition = cameraPositions.current[index]
    if (!newPosition) return

    startPosition.current.copy(cameraRef.current.position)
    targetPosition.current.copy(newPosition.position)

    // Ustawienia rotacji szachownicy
    startRotation.current = chessModel.current?.rotation.y || 0
    if (index === 3) {
      // Obrót szachownicy o 90 stopni dla widoku z boku
      targetRotation.current = startRotation.current + Math.PI / 2
    } else if (index === 2) {
      // Cofnij obrót do pierwotnej rotacji
      targetRotation.current = 0
    } else {
      targetRotation.current = startRotation.current // Nie obracaj w innych przypadkach
    }

    // Aktualizacja indeksu i stanu
    currentPositionIndex.current = index
    setCurrentIndex(index)
    transitioning.current = true
    startTransitionTime.current = performance.now()

    // Wyświetl przycisk, jeśli dotyczy ostatniej pozycji
    if (index === lastPosition) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }

  const renderButton = () => {
    if (showButton) {
      return <Button />
    }
  }

  const RenderText = () => {
    const currentText = textTab[currentPositionIndex.current] // Pobierz tekst na podstawie indeksu
    if (!currentText) return null

    // Oblicz dynamiczną wartość `top`
    const topPosition = 20 + currentPositionIndex.current * 10

    return (
      <div
        key={currentPositionIndex.current} // Klucz wymuszający odświeżenie
        className={`${styles.textContainer} ${currentPositionIndex.current % 2 === 0 ? styles.textLeft : styles.textRight} ${styles.animateText}`}
        style={{ top: `${topPosition}%` }} // Dynamiczna pozycja `top`
      >
        <h1 className={`${fraunces.className} ${styles.textTitle}`}>{currentText.title}</h1>
        <p className={`${fraunces.className} ${styles.textDescription}`}>{currentText.description}</p>
      </div>
    )
  }

  useEffect(() => {
    console.log("Chessboard mounted")
    if (!mountRef.current) {
      console.error("mountRef.current jest null!")
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera

    // Ustaw początkową pozycję kamery
    if (cameraPositions.current[0]) {
      camera.position.copy(cameraPositions.current[0].position)
      camera.lookAt(cameraPositions.current[0].lookAt)
    }

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

    const handleResize = () => {
      if (mountRef.current && cameraRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight

        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)

        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()

        // Wymuszenie ponownego renderowania sceny po resize
        renderer.clear()
        renderer.render(scene, cameraRef.current)
      }
    }
    window.addEventListener("resize", handleResize)

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

      scene.environment = texture
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableRotate = false
    controls.enablePan = false
    controls.enableZoom = false

    const ambientLight = new THREE.AmbientLight(0x808080, 0.7) // Jaśniejsze światło otoczenia
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 150) // Mocniejsze światło punktowe
    pointLight.position.set(0, 20, 10) // Wyższe ustawienie nad szachownicą
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

    const loaderGLTF = new GLTFLoader()
    loaderGLTF.load(
      "/models/landing-page/landing-chessboard.glb",
      (gltf) => {
        const model = gltf.scene
        const updateModelScale = () => {
          const isMobile = window.innerWidth < 768
          const scaleFactor = isMobile ? 6 : 11
          model.scale.set(scaleFactor, scaleFactor, scaleFactor)
        }
        updateModelScale()
        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true
          }
        })

        chessModel.current = model // Zachowaj referencję do szachownicy
        scene.add(model)
        window.addEventListener("resize", updateModelScale)
      },
      undefined,
      (error) => {
        console.error("Błąd ładowania modelu:", error)
      },
    )

    const handleScroll = (event: WheelEvent) => {
      if (currentPositionIndex.current === lastPosition) {
        setShowButton(true)
      } else {
        if (transitioning.current || !cameraPositions.current.length) return

        const direction = event.deltaY > 0 ? 1 : -1
        const newIndex = (currentPositionIndex.current + direction + cameraPositions.current.length) % cameraPositions.current.length

        const newPosition = cameraPositions.current[newIndex]
        if (!newPosition) return

        // Ustawienia pozycji kamery
        startPosition.current.copy(camera.position)
        targetPosition.current.copy(newPosition.position)

        // Ustawienia rotacji szachownicy
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

        if (newIndex === lastPosition) {
          setShowButton(true)
        }
      }
    }

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

      if (newIndex === lastPosition) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    // Dodana obsługa klawiszy strzałek góra/dół
    const handleKeyDown = (event: KeyboardEvent) => {
      if (transitioning.current || !cameraRef.current) return;
      let direction = 0;
      if (event.key === "ArrowDown") {
        direction = 1;
      } else if (event.key === "ArrowUp") {
        direction = -1;
      }
      if (direction === 0) return;

      const newIndex = (currentPositionIndex.current + direction + cameraPositions.current.length) % cameraPositions.current.length;
      const newPosition = cameraPositions.current[newIndex];
      if (!newPosition) return;

      startPosition.current.copy(cameraRef.current.position);
      targetPosition.current.copy(newPosition.position);

      startRotation.current = chessModel.current?.rotation.y || 0;
      if (newIndex === 3) {
        targetRotation.current = startRotation.current + Math.PI / 4;
      } else if (newIndex === 2) {
        targetRotation.current = 0;
      } else {
        targetRotation.current = startRotation.current;
      }

      currentPositionIndex.current = newIndex;
      setCurrentIndex(newIndex);
      transitioning.current = true;
      startTransitionTime.current = performance.now();

      if (newIndex === lastPosition) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
    window.addEventListener("wheel", handleScroll)
    window.addEventListener("keydown", handleKeyDown)

    const animate = () => {
      requestAnimationFrame(animate)

      if (transitioning.current && startTransitionTime.current !== null) {
        const elapsedTime = performance.now() - startTransitionTime.current
        const rawProgress = Math.min(elapsedTime / animationDuration, 1)
        const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
        const progress = easeInOutQuad(rawProgress)

        // Interpolacja pozycji kamery
        camera.position.lerpVectors(startPosition.current, targetPosition.current, progress)

        // Rotacja szachownicy
        if (chessModel.current) {
          chessModel.current.rotation.y = startRotation.current + (targetRotation.current - startRotation.current) * progress
        }

        const currentLookAt = cameraPositions.current[currentPositionIndex.current]?.lookAt
        if (currentLookAt) camera.lookAt(currentLookAt)

        if (rawProgress === 1) {
          transitioning.current = false
          startTransitionTime.current = null
        }
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("wheel", handleScroll)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("keydown", handleKeyDown)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [lastPosition])

  return (
    <div className="mainContainer">
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        {/* Kontener Three.js – zawsze renderowany */}
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

        {/* Overlay z progress barem */}
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
