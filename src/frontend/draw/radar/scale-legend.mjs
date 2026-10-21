import { drawRadarScale } from "./scale.mjs";
import { drawRadarLegendTable } from "./legend/table.mjs";

export function drawRadarScaleLegend(
  context,
  width,
  height,
  range,
  radius,
  connected = true,
  ilsVisible = true,
  procedureVisibility = { sidVisible: true, starVisible: true },
  waterVisible = true,
  airwayVisibility = { Q: true, J: true, V: true },
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
) {
  const procedures =
    typeof procedureVisibility === "boolean"
      ? { sidVisible: procedureVisibility, starVisible: procedureVisibility }
      : procedureVisibility;
  drawRadarLegendTable(context, width, height, connected, {
    ilsVisible,
    ...procedures,
    airwayQVisible: airwayVisibility.Q,
    airwayJVisible: airwayVisibility.J,
    airwayVVisible: airwayVisibility.V,
    ...runwayVisibility,
    airportVisible: referenceVisibility.airportsVisible,
    navaidsVisible: referenceVisibility.navaidsVisible,
    waterVisible,
  });
  drawRadarScale(context, range, radius, height);
}
