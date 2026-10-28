import { selectDefaultRadarRange } from "../../../radar/range.mjs";

export function updateCanvasRadarAutoZoom(state, distances) {
  if (!state.autoZoom) return;
  state.range = selectDefaultRadarRange(distances, state.defaultRangeNm);
}
