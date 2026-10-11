import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { createRadarRenderer } from "./create-radar-renderer.mjs";
import { createRadarCamera } from "./radar-camera.mjs";
import { DEFAULT_RADAR_RANGE, selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createRadarSceneOverlays } from "./radar-scene-overlays.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";
import { createAircraftDisplayOverlay } from "./aircraft-display-overlay.mjs";
import { watchRadarTargets } from "./watch-radar-targets.mjs";
import { createRadarRenderLoop } from "./radar-render-loop.mjs";

export function createAircraftScene({ container, location, elevationFeet, windowRef = window }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 1000);
  camera.up.set(0, 0, -1);
  const renderer = createRadarRenderer({ THREE, windowRef });
  container.appendChild(renderer.domElement);
  const updateRings = createRadarSceneOverlays(THREE, scene);
  const home = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x00ff41 }),
  );
  scene.add(home);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const overlay = createAircraftDisplayOverlay({
    THREE,
    container,
    windowRef,
    documentRef: windowRef.document ?? globalThis.document,
  });
  let autoZoom = true;
  const radarCamera = createRadarCamera({
    camera,
    controls,
    scene,
    element: renderer.domElement,
    windowRef,
    onManualZoom: () => (autoZoom = false),
    onRangeChange: (range) => {
      updateRings(range);
    },
  });
  radarCamera.setRange(DEFAULT_RADAR_RANGE);
  const stopTargetWatch = watchRadarTargets({
    targets,
    windowRef,
    onExpire: (expired) => {
      trails.remove(expired);
      if (autoZoom) radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
  });
  const stopRenderLoop = createRadarRenderLoop({
    renderer,
    scene,
    camera,
    container,
    windowRef,
    onFrame: () =>
      overlay.draw(targets.items(), trails, location, elevationFeet, camera, radarCamera.range()),
  });
  return {
    update(aircraft) {
      const position = projectAircraftPosition(aircraft, location, elevationFeet);
      if (!position) return;
      const expired = targets.update(aircraft, Math.hypot(position.x, position.z));
      trails.remove(expired);
      trails.add(aircraft.icao, position);
      if (autoZoom) {
        const nextRange = selectDefaultRadarRange(targets.distances());
        if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
      }
    },
    reset() {
      scene.rotation.y = 0;
      autoZoom = true;
      radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
    destroy() {
      stopRenderLoop();
      stopTargetWatch();
      overlay.destroy();
      radarCamera.dispose();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}
