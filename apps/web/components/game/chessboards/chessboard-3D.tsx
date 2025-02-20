import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"

// Definicja interfejsu dla modeli figur
interface Pieces {
  pawn: THREE.Object3D
  rook: THREE.Object3D
  knight: THREE.Object3D
  bishop: THREE.Object3D
  queen: THREE.Object3D
  king: THREE.Object3D
}

/**
 * ChessBoard3D - Komponent renderujący trójwymiarową szachownicę wraz z figurami.
 *
 * Zadania komponentu:
 *  - Inicjalizacja sceny, kamery i renderera.
 *  - Ładowanie i centrowanie modelu szachownicy.
 *  - Obliczanie obszaru gry (bez obramówki) oraz rozmiaru pojedynczego pola.
 *  - Asynchroniczne ładowanie modeli figur i rozmieszczenie ich w środkach pól.
 *  - Ustawienie OrbitControls z zablokowanym przesuwaniem (panning) oraz ograniczeniem obracania,
 *    gdzie kąt minimalny jest zmodyfikowany o dodatkowe 5° w porównaniu do pierwotnego ustawienia.
 *  - Ciągłe monitorowanie zmian rozmiaru kontenera (ResizeObserver z debounce) i aktualizacja kamery.
 *
 * @returns {JSX.Element} Element div zawierający renderowaną scenę 3D.
 */
export function ChessBoard3D(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const BOARD_SCALE = 14
    const PIECE_SCALE = 15

    const scene = new THREE.Scene()

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    camera.position.set(0, 10, 15)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    // Inicjalizacja OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false // Blokujemy przesuwanie kamery
    controls.target.set(0, 0, 0)
    controls.update()

    const initialDistance = camera.position.distanceTo(controls.target)
    controls.maxDistance = initialDistance
    controls.minDistance = initialDistance * 0.8

    // Ustawienie ograniczenia kąta polarnego:
    const distXZ = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
    const heightY = camera.position.y
    const startPolarAngle = Math.atan2(distXZ, heightY)
    // Dodajemy dodatkowe 5 stopni (w radianach) do możliwości obracania w górę
    const extraAngle = 15 * (Math.PI / 180)
    controls.minPolarAngle = Math.max(0, startPolarAngle - extraAngle)
    controls.maxPolarAngle = Math.PI / 2

    const loader = new GLTFLoader()

    /**
     * adjustPiecePivot
     * Dostosowuje pivot modelu figury, aby jej dolna krawędź znalazła się na poziomie 0.
     *
     * @param {THREE.Object3D} piece - Model figury.
     */
    const adjustPiecePivot = (piece: THREE.Object3D): void => {
      piece.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(piece)
      const deltaY = -box.min.y
      piece.position.y += deltaY
    }

    loader.load(
      "/models/game/game-chessboard.glb",
      (gltf: GLTF) => {
        const board = gltf.scene
        board.scale.set(BOARD_SCALE, BOARD_SCALE, BOARD_SCALE)
        board.updateMatrixWorld(true)
        const boardBox = new THREE.Box3().setFromObject(board)
        const boardCenter = new THREE.Vector3()
        boardBox.getCenter(boardCenter)
        board.position.x -= boardCenter.x
        board.position.y -= boardCenter.y
        board.position.z -= boardCenter.z
        board.updateMatrixWorld(true)
        scene.add(board)

        boardBox.setFromObject(board)
        const borderRatio = 0.08
        const widthFull = boardBox.max.x - boardBox.min.x
        const heightFull = boardBox.max.z - boardBox.min.z
        const borderX = widthFull * borderRatio
        const borderZ = heightFull * borderRatio
        const playableMinX = boardBox.min.x + borderX
        const playableMaxX = boardBox.max.x - borderX
        const playableMinZ = boardBox.min.z + borderZ
        const playableMaxZ = boardBox.max.z - borderZ
        const playableWidth = Math.min(playableMaxX - playableMinX, playableMaxZ - playableMinZ)
        const cellSize = playableWidth / 8

        loadPieces(cellSize, playableMinX, playableMinZ)
      },
      undefined,
      (error) => console.error("Błąd ładowania szachownicy:", error),
    )

    async function loadPieces(cellSize: number, playableMinX: number, playableMinZ: number): Promise<void> {
      const loadModel = (url: string): Promise<GLTF> =>
        new Promise((resolve, reject) => {
          loader.load(url, (gltf: GLTF) => resolve(gltf), undefined, reject)
        })

      const getPosition = (file: number, rank: number): THREE.Vector3 => {
        const x = playableMinX + file * cellSize + cellSize * 0.5
        const z = playableMinZ + rank * cellSize + cellSize * 0.5
        return new THREE.Vector3(x, 0, z)
      }

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

      const pieceModels: { white: Pieces; black: Pieces } = {
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

      const backRankOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

      for (let file = 0; file < 8; file++) {
        const type = backRankOrder[file] as keyof Pieces
        const piece = pieceModels.white[type].clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 0))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
      for (let file = 0; file < 8; file++) {
        const piece = pieceModels.white.pawn.clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 1))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
      for (let file = 0; file < 8; file++) {
        const type = backRankOrder[file] as keyof Pieces
        const piece = pieceModels.black[type].clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 7))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
      for (let file = 0; file < 8; file++) {
        const piece = pieceModels.black.pawn.clone()
        piece.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        piece.position.copy(getPosition(file, 6))
        adjustPiecePivot(piece)
        scene.add(piece)
      }
    }

    const animate = (): void => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    let resizeTimer: number
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          renderer.setSize(width, height)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }
      }, 100)
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      renderer.dispose()
      controls.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-full">
      <div ref={containerRef} style={{ width: "100%", height: "100%", aspectRatio: "2" }} />
    </div>
  )
}
