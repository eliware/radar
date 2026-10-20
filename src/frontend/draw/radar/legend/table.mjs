import { getRadarPalette } from "../../../radar/palette.mjs";
import { radarLegendLayout } from "./entries.mjs";
import { readToggleState } from "../../../toggle-state-storage.mjs";

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

export function drawRadarLegendTable(context, width, height, connected, visibility) {
  const palette = getRadarPalette(connected);
  context.font = '12px Consolas, "Courier New", monospace';
  context.textAlign = "left";
  radarLegendLayout(width, height).forEach(({ entry, x, y }) => {
    const [icon, label, color, toggle] = entry;
    const enabled = !toggle || getVisibility(toggle, visibility);
    const ink = connected && enabled ? (palette[color] ?? COLORS[color]) : "#444444";
    context.fillStyle = ink;
    context.strokeStyle = ink;
    drawIcon(context, icon, x, y - 4);
    context.fillText(label, x + 14, y);
  });
}

function getVisibility(toggle, visibility) {
  if (toggle === "metarVisible") return readToggleState("metar");
  if (toggle === "flightStripsVisible") return readToggleState("flightStrips");
  return visibility[toggle];
}

function drawIcon(context, icon, x, y) {
  context.beginPath();
  if (icon === "diamond") {
    context.moveTo(x, y - 4);
    context.lineTo(x + 4, y);
    context.lineTo(x, y + 4);
    context.lineTo(x - 4, y);
    context.closePath();
    context.stroke();
    return;
  }
  if (icon === "circle") {
    context.arc(x, y, 2.5, 0, Math.PI * 2);
    context.fill();
    return;
  }
  if (icon === "cross") {
    context.moveTo(x - 4, y);
    context.lineTo(x + 4, y);
    context.moveTo(x, y - 4);
    context.lineTo(x, y + 4);
  } else if (icon === "slash") {
    context.moveTo(x - 3, y + 3);
    context.lineTo(x + 3, y - 3);
  } else if (icon === "wave") {
    context.moveTo(x - 5, y);
    context.lineTo(x - 2, y - 2);
    context.lineTo(x + 1, y + 2);
    context.lineTo(x + 5, y);
  } else {
    context.moveTo(x - 5, y);
    context.lineTo(x + 5, y);
  }
  context.setLineDash(icon === "dash" || icon === "wave" ? [2, 2] : []);
  context.stroke();
  context.setLineDash([]);
}
