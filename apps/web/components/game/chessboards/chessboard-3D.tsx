"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import React, { useRef, useEffect, useState } from "react" // React i hooki do efektów, referencji oraz stanu
import * as THREE from "three" // Biblioteka Three.js do renderowania 3D
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js" // Kontroler orbity dla kamery
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js" // Loader modeli GLTF
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import LoadingAnimation from "./loading/loading-animation" // Komponent animacji ładowania

/**
 * Position
 *
 * Interfejs definiujący pozycję na szachownicy.
 *
 * @property {number} x - Współrzędna X (kolumna).
 * @property {number} y - Współrzędna Y (rząd).
 * @property {string} notation - Notacja szachowa pozycji (np. "e4").
 * @property {{ type: string; color: string } | null} figure - Informacje o figurze na pozycji lub null.
 */
interface Position {
  x: number
  y: number
  notation: string
  figure: { type: string; color: string } | null
}

/**
 * Pieces
 *
 * Interfejs definiujący modele figur szachowych w 3D.
 *
 * @property {THREE.Object3D} pawn - Model pionka.
 * @property {THREE.Object3D} rook - Model wieży.
 * @property {THREE.Object3D} knight - Model skoczka.
 * @property {THREE.Object3D} bishop - Model gońca.
 * @property {THREE.Object3D} queen - Model hetmana.
 * @property {THREE.Object3D} king - Model króla.
 */
interface Pieces {
  pawn: THREE.Object3D
  rook: THREE.Object3D
  knight: THREE.Object3D
  bishop: THREE.Object3D
  queen: THREE.Object3D
  king: THREE.Object3D
}

/**
 * ChessBoard3DProps
 *
 * Interfejs definiujący właściwości komponentu ChessBoard3D.
 *
 * @property {string} title - Tytuł wyświetlany podczas ładowania.
 * @property {string} desc - Opis wyświetlany podczas ładowania.
 * @property {string} selectedColor - Wybrany kolor gracza ("white" lub "black").
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface ChessBoard3DProps {
  title: string
  desc: string
  selectedColor: string
}

/**
 * ChessBoard3D
 *
 * Komponent szachownicy 3D, renderujący interaktywną planszę szachową z modelami 3D figur.
 * Obsługuje ruchy, animacje, podświetlenia i szach.
 *
 * @param {ChessBoard3DProps} props - Właściwości komponentu, w tym tytuł, opis i wybrany kolor.
 * @returns {JSX.Element} Element JSX reprezentujący szachownicę 3D.
 *
 * @remarks
 * Komponent używa Three.js do renderowania sceny 3D, z obsługą ładowania modeli GLTF, animacji figur
 * i interakcji myszą. Stylizacja planszy zależy od motywu (jasny/ciemny), a kolory figur od wybranego
 * koloru gracza. Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function ChessBoard3D({ title, desc, selectedColor }: ChessBoard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null) // Referencja do kontenera renderera
  const { board, movePiece, currentPlayer, getValidMoves } = useGameContext() // Dane gry z kontekstu
  const boardRef = useRef(board) // Referencja do aktualnego stanu planszy
  const movePieceRef = useRef(movePiece) // Referencja do funkcji przesuwania figur
  const currentPlayerRef = useRef(currentPlayer) // Referencja do aktualnego gracza
  const getValidMovesRef = useRef(getValidMoves) // Referencja do funkcji pobierania ruchów
  const { theme } = useTheme() // Hook do pobierania motywu
  const [modelsLoaded, setModelsLoaded] = useState(false) // Stan ładowania modeli

  // Aktualizacja referencji przy zmianie kontekstu gry
  useEffect(() => {
    boardRef.current = board
    movePieceRef.current = movePiece
    currentPlayerRef.current = currentPlayer
    getValidMovesRef.current = getValidMoves
  }, [board, movePiece, currentPlayer, getValidMoves])

  // Główny efekt konfigurujący scenę 3D
  useEffect(() => {
    if (!containerRef.current) return

    const BOARD_SCALE = 14 // Skala modelu szachownicy
    const PIECE_SCALE = 15 // Skala modeli figur
    const scene = new THREE.Scene() // Nowa scena 3D
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000) // Kamera perspektywiczna
    camera.position.set(0, 10, -15) // Początkowa pozycja kamery (od strony białych)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // Renderer WebGL
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0) // Przezroczyste tło
    container.appendChild(renderer.domElement)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // Światło ambientowe
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // Światło kierunkowe
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const controls = new OrbitControls(camera, renderer.domElement) // Kontroler orbity
    controls.enableDamping = true
    controls.enablePan = false
    controls.target.set(0, 0, 0)
    controls.update()
    const initialDistance = camera.position.distanceTo(controls.target)
    controls.maxDistance = initialDistance * 1.2 // Maksymalny dystans kamery
    controls.minDistance = initialDistance * 0.7 // Minimalny dystans kamery
    const distXZ = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
    const heightY = camera.position.y
    const startPolarAngle = Math.atan2(distXZ, heightY)
    const extraAngle = 15 * (Math.PI / 180)
    controls.minPolarAngle = Math.max(0, startPolarAngle - extraAngle) // Minimalny kąt polarny
    controls.maxPolarAngle = Math.PI / 2 // Maksymalny kąt polarny
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    }

    const loader = new GLTFLoader() // Loader modeli GLTF

    /**
     * adjustPiecePivot
     *
     * Funkcja korygująca punkt obrotu figury, aby stała na powierzchni szachownicy.
     *
     * @param {THREE.Object3D} piece - Model figury 3D.
     */
    function adjustPiecePivot(piece: THREE.Object3D): void {
      piece.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(piece)
      const deltaY = -box.min.y
      piece.position.y += deltaY
    }

    /**
     * easeInOutQuad
     *
     * Funkcja easingowa (kwadratowa) dla płynnych animacji.
     *
     * @param {number} t - Postęp animacji (0-1).
     * @returns {number} Zmiękczony postęp animacji.
     */
    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    /**
     * animatePieceMovement
     *
     * Funkcja animująca ruch figury do pozycji docelowej.
     *
     * @param {THREE.Object3D} piece - Model figury 3D.
     * @param {THREE.Vector3} target - Docelowa pozycja.
     * @param {number} duration - Czas trwania animacji (ms).
     * @param {() => void} [onComplete] - Funkcja wywoływana po zakończeniu.
     */
    function animatePieceMovement(piece: THREE.Object3D, target: THREE.Vector3, duration: number, onComplete?: () => void) {
      const initialPosition = piece.position.clone()
      const startTime = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutQuad(progress)
        piece.position.lerpVectors(initialPosition, target, easedProgress)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else if (onComplete) {
          onComplete()
        }
      }
      requestAnimationFrame(animate)
    }

    /**
     * animatePieceY
     *
     * Funkcja animująca ruch figury w osi Y (np. podnoszenie).
     *
     * @param {THREE.Object3D} piece - Model figury 3D.
     * @param {number} targetY - Docelowa wysokość Y.
     * @param {number} duration - Czas trwania animacji (ms).
     */
    function animatePieceY(piece: THREE.Object3D, targetY: number, duration: number) {
      const initialY = piece.position.y
      const startTime = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutQuad(progress)
        piece.position.y = initialY + (targetY - initialY) * easedProgress
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }

    let playableMinX = 0 // Minimalna granica X grywalnego obszaru
    let playableMinZ = 0 // Minimalna granica Z grywalnego obszaru
    let cellSize = 1 // Rozmiar komórki szachownicy
    const selectablePieces: THREE.Object3D[] = [] // Lista figur, które można wybrać
    let boardBox: THREE.Box3 | null = null // Bounding box szachownicy
    let validMoves: Position[] = [] // Lista dostępnych ruchów
    let originPosition: THREE.Vector3 | null = null // Początkowa pozycja wybranej figury
    const highlightMeshes: THREE.Mesh[] = [] // Lista podświetleń pól
    let checkHighlight: { plane: THREE.Mesh; border: THREE.Line } | null = null // Podświetlenie szacha

    /**
     * updateCheckHighlight
     *
     * Funkcja aktualizująca podświetlenie pola króla w szachu.
     */
    function updateCheckHighlight() {
      if (checkHighlight) {
        scene.remove(checkHighlight.plane)
        scene.remove(checkHighlight.border)
        checkHighlight.plane.geometry.dispose()
        if (checkHighlight.plane.material instanceof THREE.Material) checkHighlight.plane.material.dispose()
        checkHighlight.border.geometry.dispose()
        if (checkHighlight.border.material instanceof THREE.Material) checkHighlight.border.material.dispose()
        checkHighlight = null
      }

      if (!boardRef.current) return

      const whiteInCheck = boardRef.current.isKingInCheck("white")
      const blackInCheck = boardRef.current.isKingInCheck("black")

      for (let id = 0; id < 64; id++) {
        const pos = boardRef.current.getPositionById(id)
        if (pos?.figure?.type === "king") {
          const isWhite = pos.figure.color === "white"
          if ((isWhite && whiteInCheck) || (!isWhite && blackInCheck)) {
            const x = playableMinX + (7 - pos.x) * cellSize + cellSize * 0.5
            const z = playableMinZ + (7 - pos.y) * cellSize + cellSize * 0.5
            const y = boardBox!.max.y + 0.005

            // Czerwone tło na całe pole
            const geometry = new THREE.PlaneGeometry(cellSize, cellSize)
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 })
            const plane = new THREE.Mesh(geometry, material)
            plane.rotation.x = -Math.PI / 2
            plane.position.set(x, y, z)

            // Czarny border 2px wokół całego pola
            const borderGeometry = new THREE.BufferGeometry()
            const offset = cellSize / 2
            const vertices = new Float32Array([
              -offset,
              0,
              -offset, // Bottom-left
              offset,
              0,
              -offset, // Bottom-right
              offset,
              0,
              offset, // Top-right
              -offset,
              0,
              offset, // Top-left
              -offset,
              0,
              -offset, // Zamknięcie pętli
            ])
            borderGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
            const border = new THREE.Line(borderGeometry, lineMaterial)
            border.position.set(x, y + 0.01, z)

            scene.add(plane)
            scene.add(border)
            checkHighlight = { plane, border }
            break
          }
        }
      }
    }

    /**
     * addHighlights
     *
     * Funkcja dodająca podświetlenia dla dostępnych ruchów.
     *
     * @param {Position[]} moves - Lista dostępnych ruchów.
     */
    function addHighlights(moves: Position[]) {
      clearHighlights()
      moves.forEach((move) => {
        const square = boardRef.current?.getPositionByNotation(move.notation)
        if (!square) return
        const x = playableMinX + (7 - square.x) * cellSize + cellSize * 0.5
        const z = playableMinZ + (7 - square.y) * cellSize + cellSize * 0.5
        const y = boardBox!.max.y + 0.01

        if (square.figure && square.figure.color !== currentPlayerRef.current) {
          const shape = new THREE.Shape()
          const size = cellSize * 0.8
          const largeRadius = cellSize * 0.25
          const smallRadius = cellSize * 0.125

          shape.moveTo(-size / 2 + largeRadius, -size / 2)
          shape.lineTo(size / 2 - smallRadius, -size / 2)
          shape.quadraticCurveTo(size / 2, -size / 2, size / 2, -size / 2 + smallRadius)
          shape.lineTo(size / 2, size / 2 - largeRadius)
          shape.quadraticCurveTo(size / 2, size / 2, size / 2 - largeRadius, size / 2)
          shape.lineTo(-size / 2 + largeRadius, size / 2)
          shape.quadraticCurveTo(-size / 2, size / 2, -size / 2, size / 2 - largeRadius)
          shape.lineTo(-size / 2, -size / 2 + smallRadius)
          shape.quadraticCurveTo(-size / 2, -size / 2, -size / 2 + largeRadius, -size / 2)

          const geometry = new THREE.ShapeGeometry(shape)
          const material = new THREE.MeshBasicMaterial({ color: 0x16a34a, transparent: true, opacity: 0.4 })
          const highlight = new THREE.Mesh(geometry, material)
          highlight.rotation.x = -Math.PI / 2
          highlight.position.set(x, y, z)
          scene.add(highlight)
          highlightMeshes.push(highlight)
        } else {
          const geometry = new THREE.CircleGeometry(cellSize / 5, 32)
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 })
          const circle = new THREE.Mesh(geometry, material)
          circle.rotation.x = -Math.PI / 2
          circle.position.set(x, y, z)
          scene.add(circle)
          highlightMeshes.push(circle)
        }
      })
    }

    /**
     * clearHighlights
     *
     * Funkcja usuwająca wszystkie podświetlenia pól z sceny.
     */
    function clearHighlights() {
      while (highlightMeshes.length) {
        const mesh = highlightMeshes.pop()
        if (mesh) {
          scene.remove(mesh)
          mesh.geometry.dispose()
          if (mesh.material instanceof THREE.Material) mesh.material.dispose()
        }
      }
    }

    const boardModelPath = theme === "light" ? "/models/game/chessboards/white-game-chessboard.glb" : "/models/game/chessboards/dark-game-chessboard.glb" // Ścieżka modelu szachownicy

    // Ładowanie modelu szachownicy
    loader.load(
      boardModelPath,
      (gltf: GLTF) => {
        const boardModel = gltf.scene
        boardModel.scale.set(BOARD_SCALE, BOARD_SCALE, BOARD_SCALE)
        boardModel.updateMatrixWorld(true)
        boardBox = new THREE.Box3().setFromObject(boardModel)
        const boardCenter = new THREE.Vector3()
        boardBox.getCenter(boardCenter)
        boardModel.position.sub(boardCenter)
        boardModel.updateMatrixWorld(true)
        boardBox.setFromObject(boardModel)
        scene.add(boardModel)

        const borderRatio = 0.08
        const widthFull = boardBox.max.x - boardBox.min.x
        const heightFull = boardBox.max.z - boardBox.min.z
        const borderX = widthFull * borderRatio
        const borderZ = heightFull * borderRatio
        playableMinX = boardBox.min.x + borderX
        playableMinZ = boardBox.min.z + borderZ
        const playableMaxX = boardBox.max.x - borderX
        const playableMaxZ = boardBox.max.z - borderZ
        const playableWidth = Math.min(playableMaxX - playableMinX, playableMaxZ - playableMinZ)
        cellSize = playableWidth / 8

        if (boardRef.current) loadPiecesFromBoard(cellSize, playableMinX, playableMinZ, boardBox)
      },
      undefined,
      (error) => console.error("Błąd ładowania szachownicy:", error),
    )

    /**
     * loadPiecesFromBoard
     *
     * Funkcja ładująca modele figur na podstawie stanu planszy.
     *
     * @param {number} cellSize - Rozmiar komórki szachownicy.
     * @param {number} playableMinX - Minimalna granica X grywalnego obszaru.
     * @param {number} playableMinZ - Minimalna granica Z grywalnego obszaru.
     * @param {THREE.Box3} boardBox - Bounding box szachownicy.
     * @returns {Promise<void>} Obietnica zakończenia ładowania.
     */
    async function loadPiecesFromBoard(cellSize: number, playableMinX: number, playableMinZ: number, boardBox: THREE.Box3): Promise<void> {
      const loadModel = (url: string): Promise<GLTF> => new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject))
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

      let pieceModels: { white: Pieces; black: Pieces }

      if (selectedColor === "black") {
        pieceModels = {
          black: {
            pawn: whitePawn.scene,
            rook: whiteRook.scene,
            knight: whiteKnight.scene,
            bishop: whiteBishop.scene,
            queen: whiteQueen.scene,
            king: whiteKing.scene,
          },
          white: {
            pawn: blackPawn.scene,
            rook: blackRook.scene,
            knight: blackKnight.scene,
            bishop: blackBishop.scene,
            queen: blackQueen.scene,
            king: blackKing.scene,
          },
        }
      } else {
        pieceModels = {
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
      }

      const boardTopY = boardBox.max.y
      const letters = "abcdefgh"

      for (let id = 0; id < 64; id++) {
        const pos = boardRef.current?.getPositionById(id)
        if (!pos || !pos.figure) continue

        const colorKey = pos.figure.color === "white" ? "white" : "black"

        let model: THREE.Object3D
        switch (pos.figure.type) {
          case "pawn":
            model = pieceModels[colorKey].pawn.clone()
            break
          case "rook":
            model = pieceModels[colorKey].rook.clone()
            break
          case "knight":
            model = pieceModels[colorKey].knight.clone()
            break
          case "bishop":
            model = pieceModels[colorKey].bishop.clone()
            break
          case "queen":
            model = pieceModels[colorKey].queen.clone()
            break
          case "king":
            model = pieceModels[colorKey].king.clone()
            break
          default:
            continue
        }
        model.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
        const xCoord = playableMinX + (7 - pos.x) * cellSize + cellSize * 0.5
        const zCoord = playableMinZ + (7 - pos.y) * cellSize + cellSize * 0.5
        model.position.set(xCoord, 0, zCoord)
        adjustPiecePivot(model)
        model.position.y = boardTopY
        const notation = letters.charAt(pos.x) + (8 - pos.y).toString()
        model.userData.notation = notation
        model.userData.figureColor = pos.figure.color
        model.userData.originalY = boardTopY
        scene.add(model)
        selectablePieces.push(model)
      }
      updateCheckHighlight()
      setModelsLoaded(true) // Ustawia flagę po załadowaniu modeli
    }

    const raycaster = new THREE.Raycaster() // Obiekt do wykrywania kliknięć
    const pointer = new THREE.Vector2() // Współrzędne wskaźnika myszy
    let selectedPiece: THREE.Object3D | null = null // Wybrana figura

    /**
     * handleClick
     *
     * Funkcja obsługująca kliknięcia myszą na figurach i polach.
     *
     * @param {MouseEvent} event - Zdarzenie kliknięcia myszą.
     */
    function handleClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.intersectObjects(selectablePieces, true)
      if (intersects.length > 0 && intersects[0]?.object) {
        let clickedPiece = intersects[0].object
        while (clickedPiece.parent && !selectablePieces.includes(clickedPiece)) {
          clickedPiece = clickedPiece.parent
        }

        if (selectedPiece === clickedPiece) {
          animatePieceY(selectedPiece, selectedPiece.userData.originalY, 500)
          selectedPiece = null
          validMoves = []
          clearHighlights()
          return
        }

        if (!selectedPiece) {
          if (clickedPiece.userData.figureColor !== currentPlayerRef.current) return
          selectedPiece = clickedPiece
          const originSquare = boardRef.current?.getPositionByNotation(selectedPiece.userData.notation)
          originPosition = selectedPiece.position.clone()
          validMoves = getValidMovesRef.current(originSquare) || []
          addHighlights(validMoves)
          animatePieceY(selectedPiece, selectedPiece.userData.originalY + 0.5, 500)
          return
        }
      }

      if (selectedPiece) {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        const intersectionPoint = new THREE.Vector3()
        raycaster.ray.intersectPlane(plane, intersectionPoint)
        if (intersectionPoint && boardBox) {
          const boardTopY = boardBox.max.y
          const col = Math.floor((intersectionPoint.x - playableMinX) / cellSize)
          const row = Math.floor((intersectionPoint.z - playableMinZ) / cellSize)
          const clampedCol = Math.min(Math.max(col, 0), 7)
          const clampedRow = Math.min(Math.max(row, 0), 7)
          const logicalCol = 7 - clampedCol
          const targetX = playableMinX + (7 - logicalCol) * cellSize + cellSize / 2
          const targetZ = playableMinZ + clampedRow * cellSize + cellSize / 2
          const targetPosition = new THREE.Vector3(targetX, boardTopY, targetZ)
          const letters = "abcdefgh"
          const targetRowIndex = 7 - clampedRow
          const targetNotation = letters.charAt(logicalCol) + (8 - targetRowIndex).toString()

          const targetSquare = boardRef.current?.getPositionByNotation(targetNotation)
          if (targetSquare?.figure && targetSquare.figure.color === selectedPiece.userData.figureColor) {
            const newSelected = selectablePieces.find((piece) => piece.userData.notation === targetNotation)
            if (newSelected && newSelected !== selectedPiece) {
              animatePieceY(selectedPiece, selectedPiece.userData.originalY, 500)
              selectedPiece = newSelected
              originPosition = selectedPiece.position.clone()
              const newOriginSquare = boardRef.current?.getPositionByNotation(selectedPiece.userData.notation)
              validMoves = getValidMovesRef.current(newOriginSquare) || []
              clearHighlights()
              addHighlights(validMoves)
              animatePieceY(selectedPiece, selectedPiece.userData.originalY + 0.5, 500)
            } else {
              animatePieceY(selectedPiece, selectedPiece.userData.originalY, 500)
              selectedPiece = null
              validMoves = []
              clearHighlights()
            }
            return
          }

          const isValid = validMoves.some((pos) => pos.notation === targetNotation)
          if (isValid && boardRef.current) {
            const originSquare = boardRef.current.getPositionByNotation(selectedPiece.userData.notation)
            const targetSquareBeforeMove = boardRef.current.getPositionByNotation(targetNotation)
            if (originSquare && targetSquareBeforeMove) {
              const isCapture = targetSquareBeforeMove.figure && targetSquareBeforeMove.figure.color !== selectedPiece.userData.figureColor
              const capturedPiece = isCapture ? selectablePieces.find((piece) => piece.userData.notation === targetNotation) : null

              movePieceRef.current(originSquare, targetSquareBeforeMove)
              selectedPiece.userData.notation = targetNotation

              if (isCapture && capturedPiece) {
                animatePieceMovement(selectedPiece, targetPosition, 1000, () => {
                  if (capturedPiece && capturedPiece !== selectedPiece) {
                    scene.remove(capturedPiece)
                    const capturedIndex = selectablePieces.indexOf(capturedPiece)
                    if (capturedIndex !== -1) selectablePieces.splice(capturedIndex, 1)
                  }
                  updateCheckHighlight()
                })
              } else {
                animatePieceMovement(selectedPiece, targetPosition, 1000, () => {
                  updateCheckHighlight()
                })
              }
            }
          } else if (originPosition) {
            animatePieceMovement(selectedPiece, originPosition, 500)
          }
          selectedPiece = null
          validMoves = []
          clearHighlights()
        }
      }
    }

    renderer.domElement.addEventListener("click", handleClick, false) // Dodanie nasłuchiwania kliknięć

    // Funkcja animacji sceny
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Obsługa zmiany rozmiaru okna
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
    })
    resizeObserver.observe(container)

    // Sprzątanie po odmontowaniu komponentu
    return () => {
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener("click", handleClick)
      renderer.dispose()
      controls.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, []) // Puste zależności – uruchamia się raz przy montowaniu

  // Renderowanie komponentu
  return (
    <div className="flex items-center justify-center h-full">
      <div style={{ display: modelsLoaded ? "none" : "block" }}>
        <LoadingAnimation title={title} desc={desc}></LoadingAnimation> {/* Animacja ładowania */}
      </div>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", aspectRatio: "2", display: modelsLoaded ? "block" : "none" }} // Kontener renderera
      />
    </div>
  )
}
