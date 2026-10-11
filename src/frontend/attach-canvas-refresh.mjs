export function attachCanvasRefresh(canvas, windowRef, draw, onWheel) {
  const wheel = (event) => {
    event.preventDefault();
    onWheel(event);
    draw();
  };
  canvas.addEventListener("wheel", wheel, { passive: false });
  windowRef.addEventListener("resize", draw);
  return () => {
    canvas.removeEventListener("wheel", wheel);
    windowRef.removeEventListener("resize", draw);
  };
}
