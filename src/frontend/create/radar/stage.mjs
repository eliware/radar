function createRadarStage(THREE, container, windowRef) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 1000);
  camera.up.set(0, 0, -1);
  const renderer = createRadarRenderer({ THREE, windowRef });
  container.appendChild(renderer.domElement);
  return { scene, camera, renderer };
}
import { default as createRadarRenderer } from "./renderer.mjs";
export default createRadarStage;
