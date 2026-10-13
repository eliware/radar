import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createRadarStage } from "./create-radar-stage.mjs";
import { createRadarCamera } from "./radar-camera.mjs";
import { DEFAULT_RADAR_RANGE, selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";
import { createOrbitRadarState } from "./create-orbit-radar-state.mjs";
import { startAircraftSceneLoop } from "./start-aircraft-scene-loop.mjs";
import { createRadarReferenceStore } from "./radar-reference-store.mjs";
import { createRadarSceneLayers } from "./create-radar-scene-layers.mjs";
import { updateAircraftSceneTarget } from "./update-aircraft-scene-target.mjs";
export function createAircraftScene({
  container,
  location,
  elevationFeet,
  mapOutlines,
  windowRef = window,
}) {
  const { scene, camera, renderer } = createRadarStage(THREE, container, windowRef);
  const layerOptions = { THREE, scene, container, location, elevationFeet, windowRef, mapOutlines };
  const sceneLayers = createRadarSceneLayers(layerOptions);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const references = createRadarReferenceStore();
  let autoZoom = true;
  const radarCamera = createRadarCamera({
    camera,
    controls,
    element: renderer.domElement,
    windowRef,
    onManualZoom: () => (autoZoom = false),
    onRangeChange: (range) => {
      sceneLayers.updateRings(range);
      sceneLayers.map.setRange(range);
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
    overlay: sceneLayers.overlay,
    location,
    elevationFeet,
    isConnected: () => connected,
    isAutoZoom: () => autoZoom,
    ils: sceneLayers.layers.ils,
    procedures: sceneLayers.layers.procedures,
    references,
  });
  let connected = false;
  return {
    setConnected(value) {
      connected = value;
      sceneLayers.setConnected(value);
    },
    update(aircraft) {
      updateAircraftSceneTarget(aircraft, {
        location,
        elevationFeet,
        targets,
        trails,
        isAutoZoom: () => autoZoom,
        radarCamera,
      });
    },
    ...references.updates((items) => sceneLayers.airspace.update(items)),
    setIlsVisible: sceneLayers.layers.ils.setVisible,
    ...createOrbitRadarState(controls, radarCamera),
    reset() {
      scene.rotation.y = 0;
      autoZoom = true;
      radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
    destroy() {
      stopRadarLoops();
      sceneLayers.layers.destroy();
      sceneLayers.airspace.dispose();
      sceneLayers.map();
      sceneLayers.overlay.destroy();
      radarCamera.dispose();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}
