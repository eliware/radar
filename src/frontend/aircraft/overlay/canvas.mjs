export function createAircraftOverlayCanvas(container, documentRef) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    zIndex: "1",
    pointerEvents: "none",
  });
  container.appendChild(canvas);
  return { canvas, context };
}
