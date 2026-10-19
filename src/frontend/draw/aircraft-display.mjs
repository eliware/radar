import { layoutAircraftTags } from "../layout-aircraft-tags.mjs";
import { getAircraftAgeBrightness } from "../aircraft/age-brightness.mjs";
import { getRadarPalette } from "../radar/palette.mjs";
import { getAircraftEmergencyLabel } from "../../shared/aircraft/emergency.mjs";

const EMERGENCY_COLOR = "#ff0000";
const REMOTE_ONLY_COLOR = "#80ff21";

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
  drawTrails(context, aircraft, fontSize, palette.trail);
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
  context.font = `${fontSize}px monospace`;
  for (const tag of layoutAircraftTags(context, aircraft, fontSize, width, height)) {
    const color = displayColor(tag.item, palette.bright, now);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.globalAlpha = previousAlpha * getAircraftAgeBrightness(tag.item.receivedAt);
    drawTag(context, tag, fontSize);
  }
  context.globalAlpha = previousAlpha;
}

function displayColor(item, normalColor, now) {
  if (getAircraftEmergencyLabel(item)) return EMERGENCY_COLOR;
  if (item.remoteOnly) return REMOTE_ONLY_COLOR;
  if (!item.nearHomePass) return normalColor;
  return Math.floor(now / 500) % 2 === 0 ? "#00ff41" : "#ffffff";
}

function drawTrails(context, aircraft, fontSize, trailColor) {
  context.fillStyle = trailColor;
  context.font = `${fontSize / 2}px monospace`;
  for (const item of aircraft) {
    for (const point of (item.history ?? []).slice(0, -1)) {
      context.fillText(String.fromCharCode(92), point.x, point.y);
    }
  }
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

function drawTag(context, tag, fontSize) {
  const anchorX = Math.max(tag.x, Math.min(tag.item.x, tag.x + tag.width));
  const anchorY = Math.max(tag.y, Math.min(tag.item.y, tag.y + tag.height));
  const dx = anchorX - tag.item.x;
  const dy = anchorY - tag.item.y;
  const distance = Math.hypot(dx, dy);
  const divisor = Math.max(distance, Number.EPSILON);
  const gap = Math.min(9, distance);
  context.beginPath();
  context.moveTo(tag.item.x + (dx / divisor) * gap, tag.item.y + (dy / divisor) * gap);
  context.lineTo(anchorX, anchorY);
  context.stroke();
  tag.item.lines.forEach((line, index) => {
    context.fillText(line, tag.x + 7, tag.y + fontSize + index * fontSize * 1.15);
  });
}
