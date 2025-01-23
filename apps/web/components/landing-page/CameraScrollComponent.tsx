import * as THREE from "three";

const CameraScrollComponent = (camera: THREE.PerspectiveCamera) => {
  // Pozycje docelowe kamery dla poszczególnych sekcji scrolla
  const positions: THREE.Vector3[] = [
    new THREE.Vector3(6, 10, 15), // Początkowa pozycja
    new THREE.Vector3(6, 8, 12),  // Pozycja po pierwszym scrollu
    new THREE.Vector3(6, 6, 9),   // Pozycja po drugim scrollu
    new THREE.Vector3(6, 4, 6),   // Najbliższa pozycja
  ];

  let currentSection = 0;

  // Funkcja obsługująca scroll
  const handleScroll = (event: WheelEvent) => {
    const delta = event.deltaY > 0 ? 1 : -1;
    currentSection = THREE.MathUtils.clamp(
      currentSection + delta,
      0,
      positions.length - 1
    );
  };

  // Dodanie zdarzenia scrolla
  window.addEventListener("wheel", handleScroll);

  // Funkcja animująca kamerę
  const animateCamera = () => {
    const targetPosition = positions[currentSection]; // Pobieranie pozycji
    if (targetPosition) {
      camera.position.lerp(targetPosition, 0.1); // Płynne przejście
    }
    camera.lookAt(0, 0, 0); // Kamera patrzy na centrum planszy
    requestAnimationFrame(animateCamera);
  };

  // Rozpoczęcie animacji
  animateCamera();

  return camera;
};

export default CameraScrollComponent;
