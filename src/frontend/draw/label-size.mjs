export function selectCanvasLabelSize(context, regularSize) {
  return context.canvas?.clientWidth <= 600 ? Math.min(regularSize, 9) : regularSize;
}
