import { getRadarPalette } from "./radar-palette.mjs";

const ENTRIES = [
  ["diamond", "AIRCRAFT", "bright"],
  ["line", "60s VECTOR", "bright"],
  ["slash", "HISTORY", "trail"],
  ["circle", "HOME", "bright"],
  ["circle", "AIRPORT", "airport"],
  ["cross", "VOR", "vor"],
  ["line", "RUNWAY", "runway"],
  ["dash", "EXTENSION / BASE", "extension"],
  ["dash", "I ILS", "ils", "ilsVisible"],
  ["dash", "S SID", "sid", "proceduresVisible"],
  ["dash", "S STAR", "star", "proceduresVisible"],
  ["wave", "W WATER", "water", "waterVisible"],
];

const COLORS = {
  airport: "#b8b8b8",
  vor: "#4da3ff",
  runway: "#808080",
  extension: "#404040",
  ils: "#50402e",
  sid: "#2b3d4d",
  star: "#50402e",
  water: "#7d7d7d",
};

export function drawRadarLegendTable(context, width, height, connected, visibility) {
  const palette = getRadarPalette(connected);
  const columns = width >= 640 ? 2 : 1;
  const rows = Math.ceil(ENTRIES.length / columns);
  const firstY = height - 54 - (rows - 1) * 16;
  context.font = "12px monospace";
  context.textAlign = "left";
  ENTRIES.forEach((entry, index) => {
    const [icon, label, color, toggle] = entry;
    const column = Math.floor(index / rows);
    const row = index % rows;
    const x = 12 + column * (width / columns);
    const y = firstY + row * 16;
    const enabled = !toggle || visibility[toggle];
    const ink = connected && enabled ? (palette[color] ?? COLORS[color]) : "#444444";
    context.fillStyle = ink;
    context.strokeStyle = ink;
    drawIcon(context, icon, x, y - 4);
    context.fillText(label, x + 14, y);
  });
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
