import { createAircraftDisplayOverlay } from "./aircraft-display-overlay.mjs";
import { createAirspaceVolumes } from "./create-airspace-volumes.mjs";
import { createMapOutlineLayer } from "./create-map-outline-layer.mjs";
import { createRadarHome } from "./create-radar-home.mjs";
import { createRadarLayerVisibility } from "./create-radar-layer-visibility.mjs";
import { createRadarSceneOverlays } from "./radar-scene-overlays.mjs";

export function createRadarSceneLayers({
  THREE,
  scene,
  container,
  location,
  elevationFeet,
  windowRef,
  mapOutlines,
}) {
  const updateRings = createRadarSceneOverlays(THREE, scene);
  return {
    updateRings,
    airspace: createAirspaceVolumes(THREE, scene, location, elevationFeet),
    setConnected: createRadarHome(THREE, scene, updateRings),
    layers: createRadarLayerVisibility(windowRef.document ?? globalThis.document),
    overlay: createAircraftDisplayOverlay({
      THREE,
      container,
      windowRef,
      documentRef: windowRef.document ?? globalThis.document,
    }),
    map: createMapOutlineLayer(THREE, scene, mapOutlines, location, elevationFeet),
  };
}
