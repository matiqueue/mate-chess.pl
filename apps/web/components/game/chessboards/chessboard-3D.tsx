import React, { useRef, useEffect, useContext } from "react"; // [DODANE] useContext
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

// [ZMIENIONE] zamiast importowania Board, importujemy GameContext
import { useGameContext } from "@/contexts/GameContext";
import { color } from "@shared/types/colorType";
import { figureType } from "@shared/types/figureType";

// Definicja interfejsu dla modeli figur
interface Pieces {
  pawn: THREE.Object3D;
  rook: THREE.Object3D;
  knight: THREE.Object3D;
  bishop: THREE.Object3D;
  queen: THREE.Object3D;
  king: THREE.Object3D;
}

/**
 * ChessBoard3D - Komponent renderujący trójwymiarową szachownicę wraz z figurami,
 * rozmieszczonymi według stanu planszy pobranego z GameContext.
 */
export function ChessBoard3D(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  // [DODANE] Pobieramy dane gry z GameContext
  const { board } = useGameContext();

  useEffect(() => {
    if (!containerRef.current) return;

    // Sprawdzamy, czy board jest dostępny – logujemy jego wartość
    if (!board) {
      console.warn("Board jest undefined.");
    } else {
      console.log("Board instance:", board);
      if (typeof board.getPositionById !== "function") {
        console.warn("board.getPositionById nie jest funkcją. Upewnij się, że board jest poprawną instancją.");
      }
    }

    // Parametry skalowania – możesz je dostosować
    const BOARD_SCALE = 14;
    const PIECE_SCALE = 15;
    const PIECE_OFFSET = 0.2; // [ZMIENIONE] - niewielki offset, by figury nie wtapialy się w planszę

    const scene = new THREE.Scene();
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(0, 10, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Dodajemy oświetlenie
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Inicjalizacja OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.update();
    const initialDistance = camera.position.distanceTo(controls.target);
    controls.maxDistance = initialDistance;
    controls.minDistance = initialDistance * 0.8;
    const distXZ = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
    const heightY = camera.position.y;
    const startPolarAngle = Math.atan2(distXZ, heightY);
    const extraAngle = 15 * (Math.PI / 180);
    controls.minPolarAngle = Math.max(0, startPolarAngle - extraAngle);
    controls.maxPolarAngle = Math.PI / 2;

    const loader = new GLTFLoader();

    /**
     * adjustPiecePivot
     * Ustawia pivot modelu figury, aby jej dolna krawędź znalazła się na poziomie 0.
     */
    const adjustPiecePivot = (piece: THREE.Object3D): void => {
      piece.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(piece);
      const deltaY = -box.min.y;
      piece.position.y += deltaY;
    };

    // Funkcja easing – dla płynnych animacji
    const easeInOutQuad = (t: number): number =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    // Animacja przemieszczania całego obiektu (x, y, z)
    const animatePieceMovement = (
      piece: THREE.Object3D,
      target: THREE.Vector3,
      duration: number
    ) => {
      const initialPosition = piece.position.clone();
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        piece.position.x =
          initialPosition.x + (target.x - initialPosition.x) * easedProgress;
        piece.position.y =
          initialPosition.y + (target.y - initialPosition.y) * easedProgress;
        piece.position.z =
          initialPosition.z + (target.z - initialPosition.z) * easedProgress;
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    // Animacja zmiany tylko osi Y – np. przy podnoszeniu figury
    const animatePieceY = (
      piece: THREE.Object3D,
      targetY: number,
      duration: number
    ) => {
      const initialY = piece.position.y;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        piece.position.y = initialY + (targetY - initialY) * easedProgress;
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    // Zmienne dotyczące planszy (siatki pól)
    let playableMinX: number = 0;
    let playableMinZ: number = 0;
    let cellSize: number = 1;
    const selectablePieces: THREE.Object3D[] = [];
    let boardBox: THREE.Box3 | null = null;

    // Ładujemy model planszy (szachownicy)
    loader.load(
      "/models/game/game-chessboard.glb",
      (gltf: GLTF) => {
        const boardModel = gltf.scene;
        boardModel.scale.set(BOARD_SCALE, BOARD_SCALE, BOARD_SCALE);
        boardModel.updateMatrixWorld(true);

        boardBox = new THREE.Box3().setFromObject(boardModel);
        const boardCenter = new THREE.Vector3();
        boardBox.getCenter(boardCenter);
        // Centrujemy planszę
        boardModel.position.x -= boardCenter.x;
        boardModel.position.y -= boardCenter.y;
        boardModel.position.z -= boardCenter.z;
        boardModel.updateMatrixWorld(true);
        boardBox.setFromObject(boardModel);
        scene.add(boardModel);

        const borderRatio = 0.08;
        const widthFull = boardBox.max.x - boardBox.min.x;
        const heightFull = boardBox.max.z - boardBox.min.z;
        const borderX = widthFull * borderRatio;
        const borderZ = heightFull * borderRatio;
        playableMinX = boardBox.min.x + borderX;
        playableMinZ = boardBox.min.z + borderZ;
        const playableMaxX = boardBox.max.x - borderX;
        const playableMaxZ = boardBox.max.z - borderZ;
        const playableWidth = Math.min(
          playableMaxX - playableMinX,
          playableMaxZ - playableMinZ
        );
        cellSize = playableWidth / 8;

        // Jeśli board jest prawidłowy, ładujemy figury; w przeciwnym razie tylko wyświetlamy planszę
        if (!board || typeof board.getPositionById !== "function") {
          console.warn("Brak instancji Board lub board jest nieprawidłowy.");
        } else {
          loadPiecesFromBoard(cellSize, playableMinX, playableMinZ, boardBox);
        }
      },
      undefined,
      (error) => console.error("Błąd ładowania szachownicy:", error)
    );

    // Funkcja asynchroniczna ładująca modele figur oraz rozmieszczająca je zgodnie z danymi z board
    async function loadPiecesFromBoard(
      cellSize: number,
      playableMinX: number,
      playableMinZ: number,
      boardBox: THREE.Box3
    ): Promise<void> {
      // Ładujemy modele figur (dla białych i czarnych)
      const loadModel = (url: string): Promise<GLTF> =>
        new Promise((resolve, reject) => {
          loader.load(url, (gltf: GLTF) => resolve(gltf), undefined, reject);
        });

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
        blackKing,
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
      ]);

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
      };

      // Ustalamy wysokość górnej krawędzi planszy
      const boardTopY = boardBox.max.y;

      // Rozkładamy figury – iterujemy przez wszystkie 64 pola
      for (let id = 0; id < 64; id++) {
        const pos = board.getPositionById(id);
        if (!pos) continue;
        if (pos.figure) {
          const figure = pos.figure;
          const colorKey = figure.color === color.White ? "white" : "black";
          let model: THREE.Object3D;
          // Wybieramy odpowiedni model na podstawie typu figury
          switch (figure.type) {
            case figureType.pawn:
              model = pieceModels[colorKey].pawn.clone();
              break;
            case figureType.rook:
              model = pieceModels[colorKey].rook.clone();
              break;
            case figureType.knight:
              model = pieceModels[colorKey].knight.clone();
              break;
            case figureType.bishop:
              model = pieceModels[colorKey].bishop.clone();
              break;
            case figureType.queen:
              model = pieceModels[colorKey].queen.clone();
              break;
            case figureType.king:
              model = pieceModels[colorKey].king.clone();
              break;
            default:
              continue;
          }
          model.scale.set(PIECE_SCALE, PIECE_SCALE, PIECE_SCALE);

          // Obliczamy współrzędne 3D (zakładamy, że górny rząd to pos.y=0)
          const xCoord = playableMinX + pos.x * cellSize + cellSize * 0.5;
          const zCoord = playableMinZ + (7 - pos.y) * cellSize + cellSize * 0.5;

          // 1) Ustawiamy figurę w (xCoord, 0, zCoord), pivotujemy, a następnie
          // 2) Podnosimy na wysokość planszy + offset
          model.position.set(xCoord, 0, zCoord);
          adjustPiecePivot(model);

          // [DODANE] – ustawiamy figurę na poziomie planszy + offset
          model.position.y = boardTopY;

          scene.add(model);
          selectablePieces.push(model);

          console.log(
            `Umieszczono figurę ${figure.type} na ${xCoord}, ${boardTopY}, ${zCoord}`
          );
        }
      }
    }

    // Obsługa kliknięć – przykładowa logika wyboru i animacji
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let selectedPiece: THREE.Object3D | null = null;

    function handleClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      if (!selectedPiece) {
        const intersects = raycaster.intersectObjects(selectablePieces, true);
        if (intersects.length > 0) {
          selectedPiece = intersects[0].object;
          while (
            selectedPiece.parent &&
            !selectablePieces.includes(selectedPiece)
          ) {
            selectedPiece = selectedPiece.parent;
          }
          console.log("Wybrano figurę:", selectedPiece);
          // Podniesienie figury o 0.5 jednostki (animacja 500ms)
          animatePieceY(selectedPiece, selectedPiece.position.y + 0.5, 500);
        }
      } else {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectionPoint);

        if (intersectionPoint && boardBox) {
          const boardTopY = boardBox.max.y;
          const col = Math.floor(
            (intersectionPoint.x - playableMinX) / cellSize
          );
          const row = Math.floor(
            (intersectionPoint.z - playableMinZ) / cellSize
          );
          const clampedCol = Math.min(Math.max(col, 0), 7);
          const clampedRow = Math.min(Math.max(row, 0), 7);

          const targetX = playableMinX + clampedCol * cellSize + cellSize / 2;
          const targetZ = playableMinZ + clampedRow * cellSize + cellSize / 2;

          // [ZMIENIONE] – figurę też ustawiamy na boardTopY + PIECE_OFFSET
          const targetPosition = new THREE.Vector3(
            targetX,
            boardTopY,
            targetZ
          );

          console.log(
            "Przenosimy figurę do:",
            targetX,
            boardTopY,
            targetZ
          );
          animatePieceMovement(selectedPiece, targetPosition, 1000);
        }
        selectedPiece = null;
      }
    }

    renderer.domElement.addEventListener("click", handleClick, false);

    const animate = (): void => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    let resizeTimer: number;
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }, 100);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.dispose();
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [board]);

  return (
    <div className="flex items-center justify-center h-full">
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", aspectRatio: "2" }}
      />
    </div>
  );
}
