import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { createRadarStage } from "./create-radar-stage.mjs";
import { createRadarCamera } from "./radar-camera.mjs";
import { DEFAULT_RADAR_RANGE, selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createRadarSceneOverlays } from "./radar-scene-overlays.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";
import { createAircraftDisplayOverlay } from "./aircraft-display-overlay.mjs";
import { createOrbitRadarState } from "./create-orbit-radar-state.mjs";
import { createRadarHome } from "./create-radar-home.mjs";
import { startAircraftSceneLoop } from "./start-aircraft-scene-loop.mjs";
import { createAirspaceVolumes } from "./create-airspace-volumes.mjs";
import { createRadarReferenceStore } from "./radar-reference-store.mjs";
import { createRadarLayerVisibility } from "./create-radar-layer-visibility.mjs";
export function createAircraftScene({ container, location, elevationFeet, windowRef = window }) {
  const { scene, camera, renderer } = createRadarStage(THREE, container, windowRef);
  const updateRings = createRadarSceneOverlays(THREE, scene);
  const airspace = createAirspaceVolumes(THREE, scene, location, elevationFeet);
  const setConnected = createRadarHome(THREE, scene, updateRings);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const references = createRadarReferenceStore();
  const layers = createRadarLayerVisibility(windowRef.document ?? globalThis.document);
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
    element: renderer.domElement,
    windowRef,
    onManualZoom: () => (autoZoom = false),
    onRangeChange: (range) => {
      updateRings(range);
    },
  });
  radarCamera.setRange(DEFAULT_RADAR_RANGE);
  const stopRadarLoops = startAircraftSceneLoop({
    targets,
    trails,
    windowRef,
    radarCamera,
    renderer,
    scene,
    camera,
    container,
    overlay,
    location,
    elevationFeet,
    isConnected: () => connected,
    isAutoZoom: () => autoZoom,
    ils: layers.ils,
    procedures: layers.procedures,
    references,
  });
  let connected = false;
  return {
    setConnected(value) {
      connected = value;
      setConnected(value);
    },
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
    ...references.updates((items) => airspace.update(items)),
    setIlsVisible: layers.ils.setVisible,
    ...createOrbitRadarState(controls, radarCamera),
    reset() {
      scene.rotation.y = 0;
      autoZoom = true;
      radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
    destroy() {
      stopRadarLoops();
      layers.destroy();
      airspace.dispose();
      overlay.destroy();
      radarCamera.dispose();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}
