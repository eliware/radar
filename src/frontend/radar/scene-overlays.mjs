import { default as createRadarRings } from "./overlays/rings.mjs";
import { default as createRadarAxes } from "./overlays/axes.mjs";

function createRadarSceneOverlays(THREE, scene, documentRef) {
  const rings = createRadarRings(THREE, scene, documentRef);
  const axes = createRadarAxes(THREE, scene);
  const updateRange = (range) => {
    rings.updateRange(range);
    axes.updateRange(range);
  };
  updateRange.setConnected = (connected) => {
    rings.setConnected(connected);
    axes.setConnected(connected);
  };
  updateRange.setConnected(false);
  return updateRange;
}
export default createRadarSceneOverlays;
