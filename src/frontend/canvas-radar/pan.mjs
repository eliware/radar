export function attachCanvasPan(canvas, onPan) {
  let drag = null;
  const down = (event) => {
    if (event.pointerType === "touch") return;
    drag = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture?.(event.pointerId);
  };
  const move = (event) => {
    if (event.pointerType === "touch" || !drag) return;
    onPan(event.clientX - drag.x, event.clientY - drag.y);
    drag = { x: event.clientX, y: event.clientY };
  };
  const end = (event) => {
    if (event.pointerType !== "touch") drag = null;
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  return () => {
    canvas.removeEventListener("pointerdown", down);
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerup", end);
    canvas.removeEventListener("pointercancel", end);
  };
}
