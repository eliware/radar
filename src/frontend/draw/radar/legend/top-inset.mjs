export function radarLegendTopInset(windowRef) {
  return windowRef.matchMedia?.("(hover: none) and (pointer: coarse)").matches ? 48 : 0;
}
