import { createRadarLegendState } from "./state.mjs";
import { drawRadarLegendTable } from "./table.mjs";

export function drawRadarScaleLegend(
  context,
  width,
  height,
  connected = true,
  ilsVisible = true,
  procedureVisibility = { sidVisible: true, starVisible: true },
  waterVisible = true,
  airwayVisibility = { Q: true, J: true, V: true },
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  legendTopInset = 0,
) {
  drawRadarLegendTable(
    context,
    width,
    height,
    connected,
    createRadarLegendState(
      ilsVisible,
      procedureVisibility,
      waterVisible,
      airwayVisibility,
      runwayVisibility,
      referenceVisibility,
    ),
    legendTopInset,
  );
}
