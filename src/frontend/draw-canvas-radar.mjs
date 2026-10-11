import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { getRadarRingRanges } from "./radar-range.mjs";

export function drawCanvasRadar(
  ctx,
  canvas,
  aircraft,
  location,
  range,
  panX,
  panY,
  windowRef,
  rotation = 0,
) {
  const width = canvas.clientWidth || 1;
  const height = canvas.clientHeight || 1;
  const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const radius = Math.max(1, Math.min(width, height) * 0.44);
  const centerX = width / 2 + panX;
  const centerY = height / 2 + panY;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  drawRings(ctx, 0, 0, radius, range);
  for (const item of aircraft.values()) {
    const position = projectAircraftPosition(item, location, 0);
    if (position) {
      drawAircraft(ctx, item, (position.x / range) * radius, (position.z / range) * radius);
    }
  }
  ctx.fillStyle = "#35d5a0";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRings(ctx, x, y, radius, range) {
  ctx.textAlign = "left";
  ctx.font = "11px sans-serif";
  for (const nm of getRadarRingRanges(range)) {
    const major = nm % 10 === 0;
    ctx.strokeStyle = major ? "#18516b" : "#103548";
    ctx.lineWidth = major ? 1.5 : 1;
    ctx.beginPath();
    ctx.arc(x, y, (nm / range) * radius, 0, Math.PI * 2);
    ctx.stroke();
    if (major || (range < 10 && nm === Math.floor(range))) {
      drawRingLabel(ctx, x, y, radius, nm, range);
    }
  }
  ctx.strokeStyle = "#176b9e";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x, y + radius);
  ctx.stroke();
}

function drawRingLabel(ctx, x, y, radius, nm, range) {
  ctx.fillStyle = "#79a9c2";
  const offset = (nm / range) * radius * Math.SQRT1_2;
  ctx.textAlign = "right";
  ctx.fillText(`${nm} nm`, x - offset - 4, y - offset - 3);
  ctx.textAlign = "left";
}

function drawAircraft(ctx, item, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((item.trackDegrees ?? 0) * Math.PI) / 180);
  ctx.fillStyle = "#ffc247";
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(5, 6);
  ctx.lineTo(0, 3);
  ctx.lineTo(-5, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  if (item.callsign) {
    ctx.fillStyle = "#e7f1ff";
    ctx.font = "12px sans-serif";
    ctx.fillText(item.callsign, x + 8, y - 8);
  }
}
