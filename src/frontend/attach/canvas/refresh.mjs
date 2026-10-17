export function attachCanvasRefresh(canvas, windowRef, draw, onWheel) {
  const wheel = (event) => {
    event.preventDefault();
    onWheel(event);
    draw();
  };
  canvas.addEventListener("wheel", wheel, { passive: false });
  windowRef.addEventListener("resize", draw);
  const resizeObserver = windowRef.ResizeObserver ? new windowRef.ResizeObserver(draw) : null;
  resizeObserver?.observe(canvas);
  return () => {
    canvas.removeEventListener("wheel", wheel);
    windowRef.removeEventListener("resize", draw);
    resizeObserver?.disconnect();
  };
}
