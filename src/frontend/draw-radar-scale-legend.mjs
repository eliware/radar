import { getRadarPalette } from "./radar-palette.mjs";
import { drawRadarScale } from "./draw-radar-scale.mjs";

export function drawRadarScaleLegend(
  context,
  width,
  height,
  range,
  radius,
  connected = true,
  ilsVisible = true,
) {
  const palette = getRadarPalette(connected);
  const firstRow = height - 96;
  const secondRow = height - 78;
  const thirdRow = height - 60;
  context.fillStyle = "#000";
  context.fillRect(8, height - 108, 212, 98);
  context.font = "12px monospace";
  context.textAlign = "left";
  context.fillStyle = palette.bright;
  context.strokeStyle = palette.bright;
  drawAircraftKey(context, 14, firstRow);
  context.fillText("AIRCRAFT", 24, firstRow);
  context.beginPath();
  context.moveTo(112, firstRow - 4);
  context.lineTo(126, firstRow - 4);
  context.stroke();
  context.fillText("60s VECTOR", 132, firstRow);
  context.fillStyle = palette.trail;
  context.fillText(String.fromCharCode(92), 14, secondRow);
  context.fillText("HISTORY", 24, secondRow);
  context.fillStyle = palette.bright;
  context.beginPath();
  context.arc(105, secondRow - 4, 2, 0, Math.PI * 2);
  context.fill();
  context.fillText("HOME", 112, secondRow);
  context.strokeStyle = ilsVisible ? "#50402e" : "#444";
  context.fillStyle = context.strokeStyle;
  context.setLineDash([3, 3]);
  context.beginPath();
  context.moveTo(14, thirdRow - 4);
  context.lineTo(26, thirdRow - 4);
  context.stroke();
  context.setLineDash([]);
  context.fillText("I ILS", 32, thirdRow);
  drawRadarScale(context, range, radius, height);
}

function drawAircraftKey(context, x, baseline) {
  const size = 4;
  context.beginPath();
  context.moveTo(x, baseline - size);
  context.lineTo(x + size, baseline);
  context.lineTo(x, baseline + size);
  context.lineTo(x - size, baseline);
  context.closePath();
  context.stroke();
}
