import { default as createRadarViewportBounds } from "./bounds.mjs";
import { default as createRadarViewportRadius } from "./radius.mjs";

function createRadarViewport(THREE, camera, controls, container, elevationFeet) {
  return {
    getViewportBounds: createRadarViewportBounds(THREE, camera, container, elevationFeet),
    visibleRadiusNm: createRadarViewportRadius(camera, controls, container),
  };
}
export default createRadarViewport;
