import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
import { useGameContext } from "@/contexts/GameContext"
import { color } from "@shared/types/colorType"
import { figureType } from "@shared/types/figureType"

interface Pieces {
  pawn: THREE.Object3D
  rook: THREE.Object3D
  knight: THREE.Object3D
  bishop: THREE.Object3D
  queen: THREE.Object3D
  king: THREE.Object3D
}

/**
 * Komponent odpowiedzialny za renderowanie trójwymiarowej szachownicy wraz z figurami.
 * @returns {JSX.Element} JSX element zawierający szachownicę 3D
 */
export function ChessBoard3D(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const { board, movePiece, currentPlayer, getValidMoves } = useGameContext()
  const boardRef = useRef(board)
  const movePieceRef = useRef(movePiece)
  const currentPlayerRef = useRef(currentPlayer)
  const getValidMovesRef = useRef(getValidMoves)

  useEffect(() => { boardRef.current = board }, [board])
  useEffect(() => { movePieceRef.current = movePiece }, [movePiece])
  useEffect(() => { currentPlayerRef.current = currentPlayer }, [currentPlayer])
  useEffect(() => { getValidMovesRef.current = getValidMoves }, [getValidMoves])

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

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.target.set(0, 0, 0)
    controls.update()
    const initialDistance = camera.position.distanceTo(controls.target)
    controls.maxDistance = initialDistance
    controls.minDistance = initialDistance * 0.8
    const distXZ = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2)
    const heightY = camera.position.y
    const startPolarAngle = Math.atan2(distXZ, heightY)
    const extraAngle = 15 * (Math.PI / 180)
    controls.minPolarAngle = Math.max(0, startPolarAngle - extraAngle)
    controls.maxPolarAngle = Math.PI / 2
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    }

    const loader = new GLTFLoader()

    /**
     * Ustawia pivot modelu figury tak, aby dolna krawędź znajdowała się na poziomie 0.
     * @param {THREE.Object3D} piece - Obiekt 3D figury
     */
    function adjustPiecePivot(piece: THREE.Object3D): void {
      piece.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(piece)
      const deltaY = -box.min.y
      piece.position.y += deltaY
    }

    /**
     * Funkcja easingu dla animacji (easeInOutQuad).
     * @param {number} t - Wartość od 0 do 1 określająca postęp animacji
     * @returns {number} - Przeliczona wartość easing
     */
    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    /**
     * Animuje ruch figury między dwoma punktami w czasie.
     * @param {THREE.Object3D} piece - Obiekt 3D figury
     * @param {THREE.Vector3} target - Wektor docelowej pozycji
     * @param {number} duration - Czas trwania animacji w ms
     */
    function animatePieceMovement(piece: THREE.Object3D, target: THREE.Vector3, duration: number) {
      const initialPosition = piece.position.clone()
      const startTime = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutQuad(progress)
        piece.position.x = initialPosition.x + (target.x - initialPosition.x) * easedProgress
        piece.position.y = initialPosition.y + (target.y - initialPosition.y) * easedProgress
        piece.position.z = initialPosition.z + (target.z - initialPosition.z) * easedProgress
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    /**
     * Animuje zmianę współrzędnej Y figury w czasie (np. unoszenie).
     * @param {THREE.Object3D} piece - Obiekt 3D figury
     * @param {number} targetY - Docelowa wartość Y
     * @param {number} duration - Czas trwania animacji w ms
     */
    function animatePieceY(piece: THREE.Object3D, targetY: number, duration: number) {
      const initialY = piece.position.y
      const startTime = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutQuad(progress)
        piece.position.y = initialY + (targetY - initialY) * easedProgress
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    let playableMinX = 0
    let playableMinZ = 0
    let cellSize = 1
    const selectablePieces: THREE.Object3D[] = []
    let boardBox: THREE.Box3 | null = null
    let validMoves: any[] = []
    let originPosition: THREE.Vector3 | null = null
    let highlightMeshes: THREE.Mesh[] = []

    /**
     * Dodaje zielone markery na polach dozwolonych ruchów.
     * @param {any[]} moves - Tablica obiektów zawierających informacje o możliwych ruchach
     */
    function addHighlights(moves: any[]) {
      // clearHighlights();
      moves.forEach(move => {
        const square = boardRef.current.getPositionByNotation(move.notation)
        if (!square) return
        const x = playableMinX + square.x * cellSize + cellSize * 0.5
        const z = playableMinZ + (7 - square.y) * cellSize + cellSize * 0.5
        const geometry = new THREE.CircleGeometry(cellSize / 4, 32)
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.5,
        })
        const circle = new THREE.Mesh(geometry, material)
        circle.rotation.x = -Math.PI / 2
        circle.position.set(x, boardBox!.max.y + 0.01, z)
        scene.add(circle)
        highlightMeshes.push(circle)
      })
    }

    /**
     * Funkcja usuwająca wszystkie podświetlone pola z planszy.
     * (Zostawiona w formie komentarza zgodnie z instrukcją)
     */
    /*
    function clearHighlights() {
      while (highlightMeshes.length) {
        const mesh = highlightMeshes.pop()
        if (mesh) {
          if (mesh.parent) mesh.parent.remove(mesh)
          if (mesh.geometry) {
            mesh.geometry.dispose()
          }
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                if (mat && typeof mat.dispose === "function") {
                  mat.dispose()
                }
              })
            } else if (typeof mesh.material.dispose === "function") {
              mesh.material.dispose()
            }
          }
        }
      }
    }
    */

    loader.load(
      "/models/game/game-chessboard.glb",
      (gltf: GLTF) => {
        const boardModel = gltf.scene
        boardModel.scale.set(BOARD_SCALE, BOARD_SCALE, BOARD_SCALE)
        boardModel.updateMatrixWorld(true)
        boardBox = new THREE.Box3().setFromObject(boardModel)
        const boardCenter = new THREE.Vector3()
        boardBox.getCenter(boardCenter)
        boardModel.position.x -= boardCenter.x
        boardModel.position.y -= boardCenter.y
        boardModel.position.z -= boardCenter.z
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

        if (boardRef.current && typeof boardRef.current.getPositionById === "function") {
          loadPiecesFromBoard(cellSize, playableMinX, playableMinZ, boardBox)
        }
      },
      undefined,
      (error) => console.error("Błąd ładowania szachownicy:", error)
    )

    /**
     * Ładuje figury z modelu 3D i umieszcza je na planszy zgodnie z pozycją w Board.
     * @param {number} cellSize - Rozmiar pojedynczego pola szachownicy
     * @param {number} playableMinX - Minimalna współrzędna X obszaru gry
     * @param {number} playableMinZ - Minimalna współrzędna Z obszaru gry
     * @param {THREE.Box3} boardBox - Skrzynka opisująca rozmiar całej planszy
     */
    async function loadPiecesFromBoard(
      cellSize: number,
      playableMinX: number,
      playableMinZ: number,
      boardBox: THREE.Box3
    ): Promise<void> {
      const loadModel = (url: string): Promise<GLTF> =>
        new Promise((resolve, reject) => {
          loader.load(url, (gltf: GLTF) => resolve(gltf), undefined, reject)
        })

      const [
        whitePawn,
        whiteRook,
        whiteKnight,
        whiteBishop,
        whiteQueen,
        whiteKing,
        blackPawn,
        blackRook,
        blackKnight,
        blackBishop,
        blackQueen,
        blackKing
      ] = await Promise.all([
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

      const boardTopY = boardBox.max.y
      const letters = "abcdefgh"

      for (let id = 0; id < 64; id++) {
        const pos = boardRef.current?.getPositionById(id)
        if (!pos) continue
        if (pos.figure) {
          const figure = pos.figure
          const colorKey = figure.color === color.White ? "white" : "black"
          let model: THREE.Object3D
          switch (figure.type) {
            case figureType.pawn:
              model = pieceModels[colorKey].pawn.clone()
              break
            case figureType.rook:
              model = pieceModels[colorKey].rook.clone()
              break
            case figureType.knight:
              model = pieceModels[colorKey].knight.clone()
              break
            case figureType.bishop:
              model = pieceModels[colorKey].bishop.clone()
              break
            case figureType.queen:
              model = pieceModels[colorKey].queen.clone()
              break
            case figureType.king:
              model = pieceModels[colorKey].king.clone()
              break
            default:
              continue
          }
          model.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE)
          const xCoord = playableMinX + pos.x * cellSize + cellSize * 0.5
          const zCoord = playableMinZ + (7 - pos.y) * cellSize + cellSize * 0.5
          model.position.set(xCoord, 0, zCoord)
          adjustPiecePivot(model)
          model.position.y = boardTopY
          const notation = letters.charAt(7 - pos.x) + (8 - pos.y).toString()
          model.userData.notation = notation
          model.userData.figureColor = figure.color
          scene.add(model)
          selectablePieces.push(model)
          console.log(
            `Umieszczono figurę ${figure.type} na ${xCoord}, ${boardTopY}, ${zCoord} z notacją ${notation}`
          )
        }
      }
    }

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let selectedPiece: THREE.Object3D | null = null

    /**
     * Obsługuje kliknięcia myszą na scenie w celu wyboru figury i wybrania pola ruchu.
     * @param {MouseEvent} event - Obiekt zdarzenia myszy
     */
    function handleClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      if (!selectedPiece) {
        const intersects = raycaster.intersectObjects(selectablePieces, true)
        if (intersects.length > 0 && intersects[0]) {
          selectedPiece = intersects[0].object
          while (selectedPiece.parent && !selectablePieces.includes(selectedPiece)) {
            selectedPiece = selectedPiece.parent
          }
          if (selectedPiece.userData.figureColor !== currentPlayerRef.current) {
            console.log("Próba wyboru figury przeciwnika. Ruch odrzucony.")
            selectedPiece = null
            return
          }
          console.log("Wybrano figurę:", selectedPiece)
          const originSquare = boardRef.current?.getPositionByNotation(selectedPiece.userData.notation)
          originPosition = selectedPiece.position.clone()
          validMoves = getValidMovesRef.current(originSquare)
          // addHighlights(validMoves)
          animatePieceY(selectedPiece, selectedPiece.position.y + 0.5, 500)
        }
      } else {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        const intersectionPoint = new THREE.Vector3()
        raycaster.ray.intersectPlane(plane, intersectionPoint)
        if (intersectionPoint && boardBox) {
          const boardTopY = boardBox.max.y
          const col = Math.floor((intersectionPoint.x - playableMinX) / cellSize)
          const row = Math.floor((intersectionPoint.z - playableMinZ) / cellSize)
          const clampedCol = Math.min(Math.max(col, 0), 7)
          const clampedRow = Math.min(Math.max(row, 0), 7)
          const targetX = playableMinX + clampedCol * cellSize + cellSize / 2
          const targetZ = playableMinZ + clampedRow * cellSize + cellSize / 2
          const targetPosition = new THREE.Vector3(targetX, boardTopY, targetZ)
          const letters = "abcdefgh"
          const targetRowIndex = 7 - clampedRow
          const targetNotation = letters.charAt(7 - clampedCol) + (8 - targetRowIndex).toString()
          console.log("Przenosimy figurę do:", targetX, boardTopY, targetZ, "notacja:", targetNotation)
          const targetSquare = boardRef.current?.getPositionByNotation(targetNotation)
          if (targetSquare?.figure && targetSquare.figure.color === selectedPiece.userData.figureColor) {
            console.log("Na tym polu znajduje się figura tego samego koloru. Zmiana zaznaczenia.")
            if (originPosition) {
              animatePieceMovement(selectedPiece, originPosition, 500)
            }
            const newSelected = selectablePieces.find(piece => piece.userData.notation === targetNotation)
            if (newSelected) {
              selectedPiece = newSelected
              originPosition = selectedPiece.position.clone()
              const newOriginSquare = boardRef.current?.getPositionByNotation(selectedPiece.userData.notation)
              validMoves = getValidMovesRef.current(newOriginSquare)
              // clearHighlights()
              // addHighlights(validMoves)
              animatePieceY(selectedPiece, selectedPiece.position.y + 0.5, 500)
            } else {
              selectedPiece = null
              validMoves = []
              // clearHighlights()
            }
            return
          }
          const isValid = validMoves.some((pos) => pos.notation === targetNotation)
          if (isValid) {
            const originSquare = boardRef.current?.getPositionByNotation(selectedPiece.userData.notation)
            const targetSquare = boardRef.current?.getPositionByNotation(targetNotation)
            if (originSquare && targetSquare) {
              movePieceRef.current(originSquare, targetSquare)
            }
            selectedPiece.userData.notation = targetNotation
            animatePieceMovement(selectedPiece, targetPosition, 1000)
          } else {
            console.log("Ruch niepoprawny – pionek wraca na swoje miejsce.")
            if (originPosition) {
              animatePieceMovement(selectedPiece, originPosition, 500)
            }
          }
        }
        selectedPiece = null
        validMoves = []
        // clearHighlights()
      }
    }

    renderer.domElement.addEventListener("click", handleClick, false)

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
      renderer.domElement.removeEventListener("click", handleClick)
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
