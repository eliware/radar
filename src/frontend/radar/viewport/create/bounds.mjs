import { FEET_PER_NM } from "../intersections.mjs";
import { default as getRadarViewportBounds } from "../bounds.mjs";

function createRadarViewportBounds(THREE, camera, container, elevationFeet) {
  return () =>
    getRadarViewportBounds(
      THREE,
      camera,
      container.clientWidth,
      container.clientHeight,
      -elevationFeet / FEET_PER_NM,
    );
}
export default createRadarViewportBounds;
