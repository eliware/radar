import { resizeCanvasBackingStore } from "../../canvas/resize.mjs";
import { createCameraProjector } from "../../project/camera-position.mjs";
import { projectRadarReference } from "../../project/radar-reference.mjs";

export function createOverlayProjection({ THREE, container, windowRef, canvas, context }) {
  let projectorCamera;
  let projectCameraPosition;

  function prepare(camera, location, elevationFeet) {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
    resizeCanvasBackingStore(canvas, context, width, height, ratio);
    if (projectorCamera !== camera) {
      projectorCamera = camera;
      projectCameraPosition = createCameraProjector(THREE, camera);
    }
    const project = (position) => projectCameraPosition(position, width, height);
    return {
      width,
      height,
      project,
      projectReference: (item) => projectRadarReference(item, location, elevationFeet, project),
    };
  }

  return { prepare };
}
