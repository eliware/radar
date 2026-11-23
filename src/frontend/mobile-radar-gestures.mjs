import { default as attachMobileRadarGestures } from "./attach/mobile/radar-gestures.mjs";
import { default as hasCoarsePointer } from "./has-coarse-pointer.mjs";

function configureMobileRadarControls(controls, element, windowRef, onZoom = () => {}) {
  if (!hasCoarsePointer(windowRef)) return () => {};
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.enableZoom = false;
  return attachMobileRadarGestures(element, {
    onZoom,
    onRotate: (angle) => {
      controls.rotateLeft(-angle);
      controls.update();
    },
  });
}
export default configureMobileRadarControls;
