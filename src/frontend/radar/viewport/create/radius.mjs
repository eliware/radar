import { default as getRadarViewportRadius } from "../radius.mjs";

function createRadarViewportRadius(camera, controls, container) {
  return () =>
    getRadarViewportRadius(camera, controls.target, container.clientWidth, container.clientHeight);
}
export default createRadarViewportRadius;
