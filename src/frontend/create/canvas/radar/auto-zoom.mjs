import { default as selectDefaultRadarRange } from "../../../radar/default-range.mjs";

function updateCanvasRadarAutoZoom(state, distances) {
  if (!state.autoZoom) return;
  state.range = selectDefaultRadarRange(distances, state.defaultRangeNm);
}
export default updateCanvasRadarAutoZoom;
