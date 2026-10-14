import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createRadarStage } from "./create-radar-stage.mjs";
import { createRadarCamera } from "./radar-camera.mjs";
import { DEFAULT_RADAR_RANGE } from "./radar-range.mjs";
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
import { createSceneWater } from "./create-scene-water.mjs";
import { createRadarViewReset } from "./create-radar-view-reset.mjs";
import { createRadarConnectionState } from "./create-radar-connection-state.mjs";
import { createAircraftSceneUpdater } from "./update-aircraft-scene.mjs";
export function createAircraftScene({ container, location, elevationFeet, windowRef = window }) {
  const { scene, camera, renderer } = createRadarStage(THREE, container, windowRef);
  const updateRings = createRadarSceneOverlays(THREE, scene);
  const airspace = createAirspaceVolumes(THREE, scene, location, elevationFeet);
  const setRadarConnected = createRadarHome(THREE, scene, updateRings);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const water = createSceneWater(THREE, scene, location, elevationFeet, controls, windowRef);
  const connection = createRadarConnectionState(setRadarConnected);
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
      water.load(range);
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
    isConnected: connection.isConnected,
    isAutoZoom: () => autoZoom,
    ils: layers.ils,
    procedures: layers.procedures,
    water,
    references,
  });
  const updateAircraft = createAircraftSceneUpdater({
    location,
    elevationFeet,
    targets,
    trails,
    radarCamera,
    isAutoZoom: () => autoZoom,
  });
  return {
    ...connection,
    update: updateAircraft,
    ...references.updates((items) => airspace.update(items)),
    setIlsVisible: layers.ils.setVisible,
    ...createOrbitRadarState(controls, radarCamera),
    reset: createRadarViewReset(scene, radarCamera, targets, (value) => (autoZoom = value)),
    destroy() {
      stopRadarLoops();
      layers.destroy();
      water.destroy();
      airspace.dispose();
      overlay.destroy();
      radarCamera.dispose();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}
