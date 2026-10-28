export function createCanvasRadarSurface(container, documentRef) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  canvas.setAttribute("aria-label", "Top-down 2D radar view");
  canvas.style.touchAction = "none";
  container.replaceChildren(canvas);
  return {
    canvas,
    context,
    destroy() {
      container.replaceChildren();
    },
  };
}
