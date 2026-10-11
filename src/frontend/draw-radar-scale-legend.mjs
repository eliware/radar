const GREEN = "#00ff41";
const TRAIL_GREEN = "#006b26";

export function drawRadarScaleLegend(context, width, height, range, radius) {
  const firstRow = height - 78;
  const secondRow = height - 60;
  context.fillStyle = "#000";
  context.fillRect(8, height - 90, 212, 80);
  context.font = "12px monospace";
  context.textAlign = "left";
  context.fillStyle = GREEN;
  context.strokeStyle = GREEN;
  drawAircraftKey(context, 14, firstRow);
  context.fillText("AIRCRAFT", 24, firstRow);
  context.beginPath();
  context.moveTo(112, firstRow - 4);
  context.lineTo(126, firstRow - 4);
  context.stroke();
  context.fillText("60s VECTOR", 132, firstRow);
  context.fillStyle = TRAIL_GREEN;
  context.fillText(String.fromCharCode(92), 14, secondRow);
  context.fillText("HISTORY", 24, secondRow);
  context.fillStyle = GREEN;
  context.beginPath();
  context.arc(105, secondRow - 4, 2, 0, Math.PI * 2);
  context.fill();
  context.fillText("HOME", 112, secondRow);
  drawScale(context, range, radius, height);
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

function drawScale(context, range, radius, height) {
  const scaleNm = selectScaleDistance(range, radius, 120);
  const length = (scaleNm / range) * radius;
  const x = 14;
  const y = height - 17;
  context.fillText(`${scaleNm} NM`, x, height - 34);
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + length, y);
  context.moveTo(x, y - 4);
  context.lineTo(x, y + 4);
  context.moveTo(x + length, y - 4);
  context.lineTo(x + length, y + 4);
  context.stroke();
}

function selectScaleDistance(range, radius, maxLength) {
  const maxDistance = (maxLength * range) / radius;
  let selected = 1;
  for (let exponent = 0; exponent <= 3; exponent += 1) {
    for (const factor of [1, 2, 5]) {
      const candidate = factor * 10 ** exponent;
      if (candidate <= maxDistance) selected = candidate;
    }
  }
  return selected;
}
