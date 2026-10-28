import { getRadarViewportRadius } from "../radius.mjs";

export function createRadarViewportRadius(camera, controls, container) {
  return () =>
    getRadarViewportRadius(camera, controls.target, container.clientWidth, container.clientHeight);
}
