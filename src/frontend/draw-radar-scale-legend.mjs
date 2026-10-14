import { drawRadarScale } from "./draw-radar-scale.mjs";
import { drawRadarLegendTable } from "./draw-radar-legend-table.mjs";

export function drawRadarScaleLegend(
  context,
  width,
  height,
  range,
  radius,
  connected = true,
  ilsVisible = true,
  proceduresVisible = true,
  waterVisible = true,
) {
  drawRadarLegendTable(context, width, height, connected, {
    ilsVisible,
    proceduresVisible,
    waterVisible,
  });
  drawRadarScale(context, range, radius, height);
}
