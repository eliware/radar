import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { configureRadarOrbitOrientation } from "./configure-radar-orbit-orientation.mjs";

const FEET_PER_NM = 6076.12;

export function createRadarControls(camera, element, homeElevationFeet = 0) {
  const screenUp = { x: camera.up.x, y: camera.up.y, z: camera.up.z };
  camera.up.set(0, 1, 0);
  const controls = new OrbitControls(camera, element);
  controls.maxPolarAngle = Math.PI / 2 - 0.01;
  const groundY = Number.isFinite(homeElevationFeet) ? -homeElevationFeet / FEET_PER_NM : 0;
  const update = controls.update.bind(controls);
  controls.update = (...args) => {
    const result = update(...args);
    const shift = Math.max(groundY - controls.target.y, groundY - camera.position.y, 0);
    if (shift > 0) {
      controls.target.y += shift;
      camera.position.y += shift;
    }
    return result;
  };
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
