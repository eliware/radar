export function prepareCanvasRadar(context, canvas, windowRef) {
  const width = canvas.clientWidth || 1;
  const height = canvas.clientHeight || 1;
  const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
  const backingWidth = Math.round(width * ratio);
  const backingHeight = Math.round(height * ratio);
  if (canvas.width !== backingWidth) canvas.width = backingWidth;
  if (canvas.height !== backingHeight) canvas.height = backingHeight;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { width, height };
}
