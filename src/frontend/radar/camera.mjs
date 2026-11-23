import { default as configureMobileRadarControls } from "../mobile-radar-gestures.mjs";
import { DEFAULT_RADAR_RANGE } from "./range.mjs";
import { default as createRadarCameraState } from "./camera/state.mjs";

function createRadarCamera({
  camera,
  controls,
  element,
  windowRef,
  onManualZoom,
  onRangeChange,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
}) {
  const state = createRadarCameraState({
    camera,
    controls,
    onManualZoom,
    onRangeChange,
    defaultRangeNm,
  });
  const onStart = () => onManualZoom();
  const onChange = state.updateRangeFromCamera;
  controls.addEventListener("start", onStart);
  controls.addEventListener("change", onChange);
  const detachGestures = configureMobileRadarControls(controls, element, windowRef, state.zoomBy);
  return {
    setRange: state.setRange,
    setRotation: state.setRotation,
    zoomBy: state.zoomBy,
    range: state.range,
    dispose() {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("change", onChange);
      detachGestures();
    },
  };
}
export default createRadarCamera;
