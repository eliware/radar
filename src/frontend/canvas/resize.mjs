const ratios = new WeakMap();

export function resizeCanvasBackingStore(canvas, context, width, height, ratio) {
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  const changed = canvas.width !== pixelWidth || canvas.height !== pixelHeight;
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
  if (changed || ratios.get(canvas) !== ratio) context.setTransform(ratio, 0, 0, ratio, 0, 0);
  ratios.set(canvas, ratio);
  return changed;
}
