import { selectDefaultRadarRange } from "../../../radar/range.mjs";

export function resetCanvasRadarView(state, draw, distances) {
  state.autoZoom = true;
  state.range = selectDefaultRadarRange(distances(), state.defaultRangeNm);
  state.offsetX = 0;
  state.offsetY = 0;
  state.rotation = state.defaultRotationRadians ?? 0;
  draw();
}
