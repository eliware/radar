import { getRadarLabelGapAngle, getRadarRingRanges, getRadarRingSpacing } from "./radar-range.mjs";

export function drawCanvasRings(context, x, y, radius, range, palette, rotation = 0) {
  const majorStep = getRadarRingSpacing(range);
  context.textAlign = "left";
  context.font = "11px sans-serif";
  for (const nm of getRadarRingRanges(range)) {
    const major = nm % majorStep === 0;
    context.strokeStyle = major ? palette.major : palette.minor;
    context.lineWidth = major ? 1.5 : 1;
    context.beginPath();
    const ringRadius = (nm / range) * radius;
    const label = major || (range < 10 && nm === Math.floor(range));
    const textWidth = context.measureText?.(`${nm}`).width ?? `${nm}`.length * 7;
    const gap = label ? getRadarLabelGapAngle(ringRadius, textWidth) : 0;
    context.arc(x, y, ringRadius, -Math.PI / 2 + gap / 2, (3 * Math.PI) / 2 - gap / 2);
    context.stroke();
    if (label) drawRingLabel(context, x, y, ringRadius, nm, palette.bright, rotation);
  }
  context.strokeStyle = palette.bright;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x - radius, y);
  context.lineTo(x + radius, y);
  context.moveTo(x, y - radius);
  context.lineTo(x, y + radius);
  context.stroke();
}

function drawRingLabel(context, x, y, ringRadius, nm, color, rotation) {
  context.save();
  context.translate(x, y - ringRadius);
  context.rotate(-rotation);
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(`${nm}`, 0, 0);
  context.restore();
  context.textAlign = "left";
}
