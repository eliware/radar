import { attachMobileRadarGestures } from "./attach-mobile-radar-gestures.mjs";

export function hasCoarsePointer(windowRef) {
  return Boolean(windowRef.matchMedia?.("(pointer: coarse)")?.matches);
}

export function configureMobileRadarControls(controls, element, windowRef, onZoom = () => {}) {
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
