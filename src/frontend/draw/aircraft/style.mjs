export function withAircraftDrawingStyle(context, draw) {
  const previousStyle = {
    fillStyle: context.fillStyle,
    strokeStyle: context.strokeStyle,
    font: context.font,
    globalAlpha: context.globalAlpha ?? 1,
  };
  try {
    return draw();
  } finally {
    context.fillStyle = previousStyle.fillStyle;
    context.strokeStyle = previousStyle.strokeStyle;
    context.font = previousStyle.font;
    context.globalAlpha = previousStyle.globalAlpha;
  }
}
