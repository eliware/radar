import { getRadarPalette } from "../../../radar/palette.mjs";
import { radarLegendLayout } from "./entries.mjs";
import { getRadarLegendVisibility } from "./visibility.mjs";
import { drawRadarLegendSymbol } from "./symbol.mjs";
import { createRadarLegendState } from "./state.mjs";

const COLORS = {
  airport: "#b8b8b8",
  vor: "#4da3ff",
  runway: "#808080",
  extension: "#404040",
  ils: "#604080",
  sid: "#2b3d4d",
  star: "#50402e",
  airwayQ: "#31534d",
  airwayJ: "#54394b",
  airwayV: "#4f4d32",
  water: "#7d7d7d",
  metar: "#00ff00",
  strips: "#ffffff",
};

export function drawRadarLegendTable(context, width, height, connected, visibility, topInset = 0) {
  const palette = getRadarPalette(connected);
  context.font = '12px Consolas, "Courier New", monospace';
  context.textAlign = "left";
  radarLegendLayout(width, height, topInset).forEach(({ entry, x, y }) => {
    const [icon, label, color, toggle] = entry;
    const enabled = !toggle || getRadarLegendVisibility(toggle, visibility);
    const ink = connected && enabled ? (palette[color] ?? COLORS[color]) : "#444444";
    context.fillStyle = ink;
    context.strokeStyle = ink;
    drawRadarLegendSymbol(context, icon, x, y - 4);
    context.fillText(label, x + 14, y);
  });
}

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
