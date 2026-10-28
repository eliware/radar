import { createRadarViewportBounds } from "./bounds.mjs";
import { createRadarViewportRadius } from "./radius.mjs";

export function createRadarViewport(THREE, camera, controls, container, elevationFeet) {
  return {
    getViewportBounds: createRadarViewportBounds(THREE, camera, container, elevationFeet),
    visibleRadiusNm: createRadarViewportRadius(camera, controls, container),
  };
}
