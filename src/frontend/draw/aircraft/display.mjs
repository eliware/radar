import { getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { getRadarPalette } from "../../radar/palette.mjs";
import { displayColor } from "./display-color.mjs";
import { drawAircraftTrails } from "./trails.mjs";
import { drawAircraftTags } from "./tags.mjs";

export function drawAircraftDisplay(
  context,
  aircraft,
  fontSize,
  width,
  height,
  connected = true,
  now = Date.now(),
) {
  const palette = getRadarPalette(connected);
  drawAircraftTrails(context, aircraft, fontSize, palette.trail);
  context.fillStyle = palette.bright;
  context.strokeStyle = palette.bright;
  const previousAlpha = context.globalAlpha ?? 1;
  for (const item of aircraft) {
    const color = displayColor(item, palette.bright, now);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.globalAlpha = previousAlpha * getAircraftAgeBrightness(item.receivedAt);
    drawTrack(context, item);
  }
  drawAircraftTags(context, aircraft, fontSize, width, height, palette.bright, previousAlpha, now);
  context.globalAlpha = previousAlpha;
}

function drawTrack(context, item) {
  if (Number.isFinite(item.futureX) && Number.isFinite(item.futureY)) {
    context.beginPath();
    context.moveTo(item.x, item.y);
    context.lineTo(item.futureX, item.futureY);
    context.stroke();
  }
  const size = 4;
  context.beginPath();
  context.moveTo(item.x, item.y - size);
  context.lineTo(item.x + size, item.y);
  context.lineTo(item.x, item.y + size);
  context.lineTo(item.x - size, item.y);
  context.closePath();
  context.stroke();
}
