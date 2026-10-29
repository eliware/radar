import { getAircraftSceneRendererDependencies } from "./renderer-dependencies.mjs";
import { createRadarControls } from "../../create/radar/controls.mjs";
import { createRadarStage } from "../../create/radar/stage.mjs";
import { createRadarCamera } from "../../radar/camera.mjs";
import { DEFAULT_RADAR_RANGE } from "../../radar/range.mjs";
import { createRadarTargets } from "../../radar/targets.mjs";
import { createRadarSceneOverlays } from "../../radar/scene-overlays.mjs";
import { createAircraftTrails } from "../trails.mjs";
import { createAircraftDisplayOverlay } from "../display-overlay.mjs";
import { createRadarHome } from "../../create/radar/home.mjs";
import { createAirspaceVolumes } from "../../create/airspace-volumes.mjs";
import { createRadarLayerVisibility } from "../../create/radar/layer/visibility.mjs";
import { createSceneWater } from "../../create/scene-water.mjs";
import { createAircraftRadarCamera } from "../../create/aircraft/radar/camera.mjs";
import { createRadarConnectionState } from "../../create/radar/connection-state.mjs";
import { createOrbitRadarState } from "../../create/orbit-radar-state.mjs";
import { destroyAircraftSceneResources } from "../../destroy/aircraft-scene-resources.mjs";

export function createAircraftSceneResources({
  container,
  location,
  elevationFeet,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
  defaultRotationDegrees = 0,
  windowRef,
}) {
  const rendererDependencies = getAircraftSceneRendererDependencies(windowRef);
  const { THREE } = rendererDependencies;
  const browserWindow = rendererDependencies.windowRef;
  const { scene, camera, renderer } = createRadarStage(THREE, container, browserWindow);
  const updateRings = createRadarSceneOverlays(THREE, scene);
  const airspace = createAirspaceVolumes(THREE, scene, location, elevationFeet);
  const setRadarConnected = createRadarHome(THREE, scene, updateRings);
  const controls = createRadarControls(camera, renderer.domElement, elevationFeet);
  const water = createSceneWater(THREE, scene, location, elevationFeet, controls, browserWindow);
  const connection = createRadarConnectionState(setRadarConnected);
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const documentRef = browserWindow.document ?? globalThis.document;
  const layers = createRadarLayerVisibility(documentRef, undefined, airspace.setVisible);
  const overlay = createAircraftDisplayOverlay({
    THREE,
    container,
    windowRef: browserWindow,
    documentRef,
  });
  const radar = createAircraftRadarCamera({
    createCamera: createRadarCamera,
    cameraOptions: {
      camera,
      controls,
      element: renderer.domElement,
      windowRef: browserWindow,
      onRangeChange: (range) => (updateRings(range), water.load(range)),
      defaultRangeNm,
    },
    targets,
    defaultRangeNm,
    defaultRotationDegrees,
  });

  return {
    connection,
    targets,
    trails,
    layers,
    overlay,
    water,
    airspace,
    radar,
    orbit: createOrbitRadarState(controls, radar.radarCamera),
    dashboardOptions: {
      THREE,
      camera,
      controls,
      container,
      elevationFeet,
      targets,
      trails,
      windowRef: browserWindow,
      radarCamera: radar.radarCamera,
      renderer,
      scene,
      overlay,
      location,
      defaultRangeNm,
      isConnected: connection.isConnected,
      isAutoZoom: radar.isAutoZoom,
      layers,
      water,
    },
    destroy(workflow) {
      destroyAircraftSceneResources({
        workflow,
        layers,
        water,
        airspace,
        overlay,
        radarCamera: radar.radarCamera,
        controls,
        renderer,
        container,
      });
    },
  };
}
