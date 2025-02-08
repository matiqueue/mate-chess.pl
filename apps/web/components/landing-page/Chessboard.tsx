import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import styles from "@/styles/landing-page/chessboard.module.css"
import Button from "@/components/landing-page/button"
import Navbar from "@/components/landing-page/navbar"
import { Fraunces } from "next/font/google"
import ScrollAnimation from "@/components/landing-page/scrollAnimation"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "300",
})

const Chessboard: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0) // Aktualny indeks pozycji kamery
  const [lastPosition, setLastPosition] = useState(5)
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
  const [textTab, setTextTab] = useState([
    {
      title: "Mate-Chess",
      description: "The battle begins. Focus your mind.",
    },
    {
      title: "Bird's Eye Strategy",
      description: "Strategic view from above.",
    },
    {
      title: "Analyze the Frontline",
      description: "A frontal perspective to analyze moves.",
    },
    {
      title: "Opponent's Perspective",
      description: "A deep look from the opponent's side.",
    },
    {
      title: "Critical Chess Insights",
      description: "Zooming in on critical details.",
    },
  ])
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
         // Dodano klasę animacji
        style={{ top: `${topPosition}%` }} // Dynamiczna pozycja `top`
      >
        <h1 className={`${fraunces.className} ${styles.textTitle}`}>{currentText.title}</h1>
        <p className={`${fraunces.className} ${styles.textDescription}`}>{currentText.description}</p>
      </div>
    )
  }
  useEffect(() => {
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
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100vw"; 
    renderer.domElement.style.height = "100vh";
    renderer.domElement.style.margin = "0";
    renderer.domElement.style.padding = "0";
    renderer.domElement.style.overflow = "hidden"; 
    renderer.shadowMap.enabled = true
    mountRef.current.appendChild(renderer.domElement)

    const handleResize = () => {
      if (mountRef.current && cameraRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
    
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio); 
    
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
    
        // ✅ Wymuszenie ponownego renderowania sceny po resize
        renderer.clear();
        renderer.render(scene, cameraRef.current);
      }
    };
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

    // Wyraźniejsze światło punktowe skierowane na szachownicę
    const pointLight = new THREE.PointLight(0xffffff, 2.0, 150) // Jeszcze mocniejsze światło punktowe
    pointLight.position.set(0, 20, 10) // Wyższe ustawienie nad szachownicą
    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 2048 // Wyższa rozdzielczość cieni
    pointLight.shadow.mapSize.height = 2048
    scene.add(pointLight)

    // Jaśniejsze światło kierunkowe dla głębi
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0) // Jeszcze bardziej widoczne
    directionalLight.position.set(10, 20, 15) // Wyżej i bardziej z boku dla lepszej głębi
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048 // Szczegółowe cienie
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    const loader = new GLTFLoader()
    loader.load(
      "/models/chess_set_1k.glb",
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
          // Obrót szachownicy o 90 stopni dla widoku z boku (4)
          targetRotation.current = startRotation.current + Math.PI / 4
        } else if (newIndex === 2) {
          // Cofnij obrót do pierwotnej rotacji
          targetRotation.current = 0
        } else {
          targetRotation.current = startRotation.current // Nie obracaj w innych przypadkach
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
      touchStartY = event.touches[0]?.clientY ?? 0 // Rejestruj pozycję początkową
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        touchEndY = event.touches[0].clientY // Aktualizuj pozycję końcową
      }
    }

    const handleTouchEnd = () => {
      if (transitioning.current || !cameraPositions.current.length || !cameraRef.current) return

      const deltaY = touchStartY - touchEndY

      // Przesunięcie w dół (deltaY > 0) lub w górę (deltaY < 0)
      const direction = deltaY > 0 ? 1 : -1
      const newIndex = (currentPositionIndex.current + direction + cameraPositions.current.length) % cameraPositions.current.length

      const newPosition = cameraPositions.current[newIndex]
      if (!newPosition) return

      // Ustawienia pozycji kamery
      startPosition.current.copy(cameraRef.current!.position)
      targetPosition.current.copy(newPosition.position)

      // Ustawienia rotacji szachownicy
      startRotation.current = chessModel.current?.rotation.y || 0
      if (newIndex === 3) {
        targetRotation.current = startRotation.current + Math.PI / 4 // Obrót o 45 stopni
      } else if (newIndex === 2) {
        targetRotation.current = 0 // Cofnij do pierwotnej rotacji
      } else {
        targetRotation.current = startRotation.current
      }

      currentPositionIndex.current = newIndex
      setCurrentIndex(newIndex)
      transitioning.current = true
      startTransitionTime.current = performance.now()

      // Sprawdź, czy wyświetlić przycisk
      if (newIndex === lastPosition) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)

    window.addEventListener("wheel", handleScroll)

    const animate = () => {
      requestAnimationFrame(animate)

      if (transitioning.current && startTransitionTime.current !== null) {
        const elapsedTime = performance.now() - startTransitionTime.current
        const rawProgress = Math.min(elapsedTime / animationDuration, 1)
        const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
        const progress = easeInOutQuad(rawProgress) // Ogranicz progress do 0-1

        // Interpolacja pozycji kamery
        camera.position.lerpVectors(startPosition.current, targetPosition.current, progress)

        // Rotacja szachownicy
        if (chessModel.current) {
          chessModel.current.rotation.y = startRotation.current + (targetRotation.current - startRotation.current) * progress
        }

        // Ustaw `lookAt` kamery
        const currentLookAt = cameraPositions.current[currentPositionIndex.current]?.lookAt
        if (currentLookAt) camera.lookAt(currentLookAt)

        if (rawProgress === 1) {
          transitioning.current = false // Zakończ animację
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
      mountRef.current?.removeChild(renderer.domElement)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <>
      <div ref={mountRef} />
      <Navbar />
      {renderButton()}
      {RenderText()}
      <div className={styles.dotsContainer}>
        {cameraPositions.current.map((_, index) => (
          <div onClick={handleDotClick} data-index={index} key={index} className={`${styles.dot} ${currentIndex === index ? styles.dotActive : ""}`}></div>
        ))}
      </div>
      <div className={styles.scrollContainer}>
        <ScrollAnimation />
      </div>
    </>
  )
}

export default Chessboard
