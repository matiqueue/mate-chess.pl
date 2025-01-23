import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CameraScrollComponent from "./CameraScrollComponent";

const Chessboard: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;

    // Tworzenie sceny
    const scene = new THREE.Scene();

    // Kamera
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      CameraScrollComponent(camera)
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Kontrolki kamery
    const controls = new OrbitControls(camera, renderer.domElement);

    // Światła
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 5, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Podłoga
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Plansza i figury
    const createChessboard = () => {
      const boardSize = 8;
      const tileSize = 1;
      const offset = (boardSize * tileSize) / 2;

      for (let x = 0; x < boardSize; x++) {
        for (let z = 0; z < boardSize; z++) {
          const color = (x + z) % 2 === 0 ? 0xffffff : 0x000000;
          const tile = new THREE.Mesh(
            new THREE.PlaneGeometry(tileSize, tileSize),
            new THREE.MeshStandardMaterial({ color })
          );
          tile.position.set(
            x * tileSize - offset + tileSize / 2,
            0.01,
            z * tileSize - offset + tileSize / 2
          );
          tile.rotation.x = -Math.PI / 2;
          tile.receiveShadow = true;
          scene.add(tile);
        }
      }
    };

    const loader = new GLTFLoader();
    const loadPiece = (
      path: string,
      position: [number, number, number],
      color: number
    ) => {
      loader.load(
        path,
        (gltf) => {
          const piece = gltf.scene;
          piece.position.set(...position);
          piece.scale.set(0.2, 0.2, 0.2);
          piece.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                color,
                metalness: 0.8,
                roughness: 0.2,
              });
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          scene.add(piece);
        },
        undefined,
        (error) => {
          console.error("Błąd podczas ładowania figury:", error);
        }
      );
    };

    const setupPieces = () => {
      const tileSize = 1;
      const offset = (8 * tileSize) / 2;

      // Pionki
      for (let i = 0; i < 8; i++) {
        loadPiece(
          "/pawn.gltf",
          [i * tileSize - offset + tileSize / 2, 0.1, -3 * tileSize + tileSize / 2],
          0xffffff
        );
        loadPiece(
          "/pawn.gltf",
          [i * tileSize - offset + tileSize / 2, 0.1, 3 * tileSize - tileSize / 2],
          0x000000
        );
      }

      // Figury
      const whitePieces = [
        "/rook.gltf",
        "/knight.gltf",
        "/bishop.gltf",
        "/queen.gltf",
        "/king.gltf",
        "/bishop.gltf",
        "/knight.gltf",
        "/rook.gltf",
      ];
      const blackPieces = [...whitePieces];

      whitePieces.forEach((path, i) => {
        loadPiece(
          path,
          [i * tileSize - offset + tileSize / 2, 0.1, -4 * tileSize + tileSize / 2],
          0xffffff
        );
      });

      blackPieces.forEach((path, i) => {
        loadPiece(
          path,
          [i * tileSize - offset + tileSize / 2, 0.1, 4 * tileSize - tileSize / 2],
          0x000000
        );
      });
    };

    createChessboard();
    setupPieces();

    // Animacja
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Chessboard;
