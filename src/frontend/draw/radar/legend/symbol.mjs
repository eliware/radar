export function drawRadarLegendSymbol(context, icon, x, y) {
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
