import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/**
 * ChessBoard3D - Komponent renderujący trójwymiarową szachownicę wraz z figurami.
 *
 * Główne zadania komponentu:
 *  - Inicjalizacja sceny, kamery i renderera.
 *  - Ładowanie i centrowanie modelu szachownicy.
 *  - Obliczanie obszaru gry (bez ramki) oraz rozmiaru pojedynczego pola.
 *  - Asynchroniczne ładowanie modeli figur i rozmieszczanie ich w środkach pól.
 *  - Ustawienie OrbitControls z ograniczeniami obrotu i zoomu.
 *  - Uruchomienie pętli renderującej oraz obsługa zmiany rozmiaru okna.
 *
 * @returns {JSX.Element} Element div zawierający renderowaną scenę 3D.
 */
export function ChessBoard3D() {
  // Referencja do kontenera, w którym umieszczony zostanie renderer Three.js.
  const containerRef = useRef()

  useEffect(() => {
    // Stałe do skalowania modelu szachownicy i figur.
    const BOARD_SCALE = 14 // Skalowanie całej szachownicy
    const PIECE_SCALE = 10 // Skalowanie figur (pionków, wież, itd.)

    // Inicjalizacja sceny 3D.
    const scene = new THREE.Scene()

    // Pobieramy kontener z DOM i jego wymiary.
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Inicjalizacja kamery perspektywicznej.
    // Parametry: FOV = 30 stopni, aspekt = width/height, zbliżenie = 0.1, oddalenie = 1000.
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    // Ustawienie początkowej pozycji kamery: x=0, y=10 (wysokość), z=15 (odległość od środka).
    camera.position.set(0, 10, 15)

    // Inicjalizacja renderera z antyaliasingiem oraz przezroczystym tłem.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0) // Przezroczyste tło
    container.appendChild(renderer.domElement) // Dodajemy renderer do DOM

    // Dodajemy globalne światło otoczenia.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    // Dodajemy światło kierunkowe.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    // Inicjalizacja OrbitControls umożliwiających interakcję z kamerą.
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    // Ustawiamy cel (target) obrotu kamery na środek sceny.
    controls.target.set(0, 0, 0)
    controls.update()

    // Ograniczamy zoom - użytkownik może jedynie przybliżać od 80% początkowej odległości, a nie oddalić.
    const initialDistance = camera.position.distanceTo(controls.target)
    controls.maxDistance = initialDistance
    controls.minDistance = initialDistance * 0.8

    // Obliczamy kąt startowy kamery (polar angle) względem osi Y.
    // distXZ - odległość w płaszczyźnie XZ, heightY - wysokość kamery (y).
    const distXZ = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
    const heightY = camera.position.y
    const startPolarAngle = Math.atan2(distXZ, heightY) // ~0.98 rad (~56°)
    // Ustawiamy, że użytkownik nie może ustawić kamery bardziej top‑down (mniejszy kąt) niż pozycja startowa.
    controls.minPolarAngle = startPolarAngle
    // Ustawiamy maksymalny kąt obrotu kamery (90°) - widok horyzontalny.
    controls.maxPolarAngle = Math.PI / 2

    // Inicjalizacja loadera GLTF do ładowania modeli.
    const loader = new GLTFLoader()

    /**
     * adjustPiecePivot
     * Dostosowuje pivot modelu figury tak, aby jej dolna część znalazła się na poziomie 0.
     * @param {THREE.Object3D} piece - Model figury, który ma zostać ustawiony.
     */
    const adjustPiecePivot = (piece) => {
      piece.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(piece)
      const deltaY = -box.min.y // Obliczamy przesunięcie wymagane do ustawienia dolnej krawędzi na y=0.
      piece.position.y += deltaY
    }

    // Ładujemy model szachownicy.
    loader.load(
      "/models/game/game-chessboard.glb",
      (gltf) => {
        const board = gltf.scene
        // Skalujemy szachownicę według stałej BOARD_SCALE.
        board.scale.set(BOARD_SCALE, BOARD_SCALE, BOARD_SCALE)
        board.updateMatrixWorld(true)

        // Centrujemy model szachownicy:
        // Obliczamy bounding box i jego środek.
        const boardBox = new THREE.Box3().setFromObject(board)
        const boardCenter = new THREE.Vector3()
        boardBox.getCenter(boardCenter)
        // Przesuwamy szachownicę tak, aby jej środek znalazł się w punkcie (0,0,0).
        board.position.x -= boardCenter.x
        board.position.y -= boardCenter.y
        board.position.z -= boardCenter.z
        board.updateMatrixWorld(true)

        scene.add(board)

        // Ponownie aktualizujemy bounding box już z przesuniętą szachownicą.
        boardBox.setFromObject(board)

        // Ustalanie obszaru gry (bez obramówki).
        // borderRatio określa procent obramówki, którą chcemy "odciąć" (tutaj 8%).
        const borderRatio = 0.08
        const widthFull = boardBox.max.x - boardBox.min.x
        const heightFull = boardBox.max.z - boardBox.min.z
        const borderX = widthFull * borderRatio
        const borderZ = heightFull * borderRatio
        const playableMinX = boardBox.min.x + borderX
        const playableMaxX = boardBox.max.x - borderX
        const playableMinZ = boardBox.min.z + borderZ
        const playableMaxZ = boardBox.max.z - borderZ
        // Aby pola były kwadratowe, wybieramy mniejszy wymiar obszaru gry.
        const playableWidth = Math.min(playableMaxX - playableMinX, playableMaxZ - playableMinZ)
        // Obliczamy rozmiar pojedynczego pola (8 pól na szachownicy).
        const cellSize = playableWidth / 8

        // Ładujemy i rozmieszczamy figury na planszy.
        loadPieces(cellSize, playableMinX, playableMinZ)
      },
      undefined,
      (error) => console.error("Błąd ładowania szachownicy:", error),
    )

    /**
     * loadPieces
     * Asynchronicznie ładuje modele figur i rozmieszcza je na szachownicy.
     * @param {number} cellSize - Rozmiar jednego pola.
     * @param {number} playableMinX - Minimalna wartość X obszaru gry (bez ramki).
     * @param {number} playableMinZ - Minimalna wartość Z obszaru gry (bez ramki).
     */
    async function loadPieces(cellSize, playableMinX, playableMinZ) {
      // Funkcja pomocnicza do ładowania modelu z danego URL.
      const loadModel = (url) =>
        new Promise((resolve, reject) => {
          loader.load(url, (gltf) => resolve(gltf), undefined, reject)
        })

      /**
       * getPosition
       * Oblicza środek pola na planszy na podstawie indeksów kolumny (file) i wiersza (rank).
       * @param {number} file - Indeks kolumny (0-7).
       * @param {number} rank - Indeks wiersza (0-7).
       * @returns {THREE.Vector3} - Pozycja środka pola.
       */
      const getPosition = (file, rank) => {
        const x = playableMinX + file * cellSize + cellSize * 0.5
        const z = playableMinZ + rank * cellSize + cellSize * 0.5
        return new THREE.Vector3(x, 0, z)
      }

      // Ładujemy wszystkie modele figur równocześnie.
      const [whitePawn, whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing, blackPawn, blackRook, blackKnight, blackBishop, blackQueen, blackKing] =
        await Promise.all([
          loadModel("/models/game/white-pawns/pawn_white.glb"),
          loadModel("/models/game/white-pawns/rook_white.glb"),
          loadModel("/models/game/white-pawns/knight_white.glb"),
          loadModel("/models/game/white-pawns/bishop_white.glb"),
          loadModel("/models/game/white-pawns/queen_white.glb"),
          loadModel("/models/game/white-pawns/king_white.glb"),
          loadModel("/models/game/black-pawns/pawn_black.glb"),
          loadModel("/models/game/black-pawns/rook_black.glb"),
          loadModel("/models/game/black-pawns/knight_black.glb"),
          loadModel("/models/game/black-pawns/bishop_black.glb"),
          loadModel("/models/game/black-pawns/queen_black.glb"),
          loadModel("/models/game/black-pawns/king_black.glb"),
        ])

      // Mapowanie modeli do kolorów i typów figur.
      const pieceModels = {
        white: {
          pawn: whitePawn.scene,
          rook: whiteRook.scene,
          knight: whiteKnight.scene,
          bishop: whiteBishop.scene,
          queen: whiteQueen.scene,
          king: whiteKing.scene,
        },
        black: {
          pawn: blackPawn.scene,
          rook: blackRook.scene,
          knight: blackKnight.scene,
          bishop: blackBishop.scene,
          queen: blackQueen.scene,
          king: blackKing.scene,
        },
      }

      // Ustalamy kolejność rozmieszczenia figur w pierwszym i ostatnim rzędzie.
      const backRankOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

      // Pętla rozmieszczająca białe figury z tylnego rzędu.
      for (let file = 0; file < 8; file++) {
        const type = backRankOrder[file]
        const piece = pieceModels.white[type].clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 0))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
      // Pętla rozmieszczająca białe pionki.
      for (let file = 0; file < 8; file++) {
        const piece = pieceModels.white.pawn.clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 1))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
      // Pętla rozmieszczająca czarne figury z tylnego rzędu.
      for (let file = 0; file < 8; file++) {
        const type = backRankOrder[file]
        const piece = pieceModels.black[type].clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 7))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
      // Pętla rozmieszczająca czarne pionki.
      for (let file = 0; file < 8; file++) {
        const piece = pieceModels.black.pawn.clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 6))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
    }

    /**
     * animate - Główna pętla renderująca scenę.
     * Wywołuje się rekurencyjnie przez requestAnimationFrame, aktualizując kontrolki i renderując scenę.
     */
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    /**
     * handleResize - Aktualizuje rozmiar renderera i parametry kamery, gdy zmienia się rozmiar okna.
     */
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", handleResize)

    // Cleanup – usuwamy event listener, disposujemy renderer i kontrolki po odmontowaniu.
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      controls.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Komponent zwraca div z referencją containerRef, w którym renderowana jest scena.
  return <div ref={containerRef} style={{ width: "100%", height: "100%", aspectRatio: "2" }} />
}
