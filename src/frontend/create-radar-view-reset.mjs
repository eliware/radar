import { selectDefaultRadarRange } from "./radar-range.mjs";

export function createRadarViewReset(scene, radarCamera, targets, setAutoZoom) {
  return () => {
    scene.rotation.y = 0;
    setAutoZoom(true);
    radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
  };
}
