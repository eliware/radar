import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { configureRadarOrbitOrientation } from "./configure-radar-orbit-orientation.mjs";

export function createRadarControls(camera, element) {
  const screenUp = { x: camera.up.x, y: camera.up.y, z: camera.up.z };
  camera.up.set(0, 1, 0);
  const controls = new OrbitControls(camera, element);
  controls.maxPolarAngle = Math.PI / 2 - 0.01;
  const restoreOrientation = configureRadarOrbitOrientation(camera, controls, screenUp);
  controls.update();
  const dispose = controls.dispose.bind(controls);
  controls.dispose = () => {
    dispose();
    restoreOrientation();
    camera.up.set(screenUp.x, screenUp.y, screenUp.z);
  };
  return controls;
}
