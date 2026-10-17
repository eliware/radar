import * as THREE from "three";
import { createRadarControls } from "./create-radar-controls.mjs";
import { createRadarStage } from "./create-radar-stage.mjs";
import { createRadarCamera } from "./radar-camera.mjs";
import { DEFAULT_RADAR_RANGE } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createRadarSceneOverlays } from "./radar-scene-overlays.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";
import { createAircraftDisplayOverlay } from "./aircraft-display-overlay.mjs";
import { createOrbitRadarState } from "./create-orbit-radar-state.mjs";
import { createRadarHome } from "./create-radar-home.mjs";
import { createAirspaceVolumes } from "./create-airspace-volumes.mjs";
import { createRadarReferenceStore } from "./radar-reference-store.mjs";
import { createRadarLayerVisibility } from "./create-radar-layer-visibility.mjs";
import { createSceneWater } from "./create-scene-water.mjs";
import { createAircraftRadarCamera } from "./create-aircraft-radar-camera.mjs";
import { createRadarConnectionState } from "./create-radar-connection-state.mjs";
import { createAircraftSceneWorkflow } from "./create-aircraft-scene-workflow.mjs";
import { destroyAircraftSceneResources } from "./destroy-aircraft-scene-resources.mjs";
export function createAircraftScene({
  container,
  location,
  elevationFeet,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
  defaultRotationDegrees = 0,
  windowRef = window,
}) {
  const { scene, camera, renderer } = createRadarStage(THREE, container, windowRef);
  const updateRings = createRadarSceneOverlays(THREE, scene);
  const airspace = createAirspaceVolumes(THREE, scene, location, elevationFeet);
  const setRadarConnected = createRadarHome(THREE, scene, updateRings);
  const controls = createRadarControls(camera, renderer.domElement, elevationFeet);
  const water = createSceneWater(THREE, scene, location, elevationFeet, controls, windowRef);
  const connection = createRadarConnectionState(setRadarConnected);
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const references = createRadarReferenceStore();
  const documentRef = windowRef.document ?? globalThis.document;
  const layers = createRadarLayerVisibility(documentRef, undefined, airspace.setVisible);
  const overlay = createAircraftDisplayOverlay({ THREE, container, windowRef, documentRef });
  const radar = createAircraftRadarCamera({
    createCamera: createRadarCamera,
    cameraOptions: {
      camera,
      controls,
      element: renderer.domElement,
      windowRef,
      onRangeChange: (range) => {
        updateRings(range);
        water.load(range);
      },
      defaultRangeNm,
    },
    targets,
    defaultRangeNm,
    defaultRotationDegrees,
  });
  const { radarCamera, reset, isAutoZoom } = radar;
  const workflow = createAircraftSceneWorkflow({
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
    defaultRangeNm,
    isConnected: connection.isConnected,
    isAutoZoom,
    layers,
    water,
    references,
  });
  return {
    ...connection,
    update: workflow.update,
    ...references.updates((items) => airspace.update(items)),
    setIlsVisible: layers.ils.setVisible,
    ...createOrbitRadarState(controls, radarCamera),
    reset,
    destroy: () =>
      destroyAircraftSceneResources({
        workflow,
        layers,
        water,
        airspace,
        overlay,
        radarCamera,
        controls,
        renderer,
        container,
      }),
  };
}
