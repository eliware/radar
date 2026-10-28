import { selectDefaultRadarRange } from "../../../radar/default-range.mjs";

export function updateCanvasRadarAutoZoom(state, distances) {
  if (!state.autoZoom) return;
  state.range = selectDefaultRadarRange(distances, state.defaultRangeNm);
}
