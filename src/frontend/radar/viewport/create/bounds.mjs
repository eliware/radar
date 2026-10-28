import { FEET_PER_NM } from "../intersections.mjs";
import { getRadarViewportBounds } from "../bounds.mjs";

export function createRadarViewportBounds(THREE, camera, container, elevationFeet) {
  return () =>
    getRadarViewportBounds(
      THREE,
      camera,
      container.clientWidth,
      container.clientHeight,
      -elevationFeet / FEET_PER_NM,
    );
}
