import { default as getAircraftSceneRendererDependencies } from "./renderer-dependencies.mjs";
import { default as createRadarControls } from "../../create/radar/controls.mjs";
import { default as createRadarStage } from "../../create/radar/stage.mjs";
import { default as createRadarCamera } from "../../radar/camera.mjs";
import { DEFAULT_RADAR_RANGE } from "../../radar/range.mjs";
import { default as createRadarTargets } from "../../radar/targets.mjs";
import { default as createRadarSceneOverlays } from "../../radar/scene-overlays.mjs";
import { default as createAircraftTrails } from "../trails.mjs";
import { default as createAircraftReceiveTimes } from "../receive-times.mjs";
import { default as createAircraftDisplayOverlay } from "../display-overlay.mjs";
import { default as createRadarHome } from "../../create/radar/home.mjs";
import { default as createAirspaceVolumes } from "../../create/airspace-volumes.mjs";
import { default as createRadarLayerVisibility } from "../../create/radar/layer/visibility.mjs";
import { default as createSceneWater } from "../../create/scene-water.mjs";
import { default as createAircraftRadarCamera } from "../../create/aircraft/radar/camera.mjs";
import { default as createRadarConnectionState } from "../../create/radar/connection-state.mjs";
import { default as createOrbitRadarState } from "../../create/orbit-radar-state.mjs";
import { default as disposeAircraftSceneResources } from "./dispose.mjs";

function createAircraftSceneResources({
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
  const receiveTimes = createAircraftReceiveTimes();
  const documentRef = browserWindow.document ?? globalThis.document;
  const layers = createRadarLayerVisibility(
    documentRef,
    undefined,
    airspace.setVisible,
    ({ localOnly }) => {
      if (!localOnly) return;
      const removed = targets.removeRemoteOnlyExcept([]);
      trails.remove(removed);
      receiveTimes.remove(removed);
    },
  );
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
      receiveTimes,
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
      disposeAircraftSceneResources({
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
export default createAircraftSceneResources;
