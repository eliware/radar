import { getRadarPalette } from "../../../radar/palette.mjs";
import { getRadarLegendVisibility } from "./visibility.mjs";

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

export function resolveRadarLegendColor(entry, connected, visibility) {
  const [, , color, toggle] = entry;
  const enabled = !toggle || getRadarLegendVisibility(toggle, visibility);
  const palette = getRadarPalette(connected);
  const ink = connected && enabled ? (palette[color] ?? COLORS[color]) : "#444444";
  return { enabled, ink };
}
