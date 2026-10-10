export function hasCoarsePointer(windowRef) {
  return Boolean(windowRef.matchMedia?.("(pointer: coarse)")?.matches);
}

export function attachMobileRadarGestures(element, { onZoom, onRotate }) {
  const pointers = new Map();
  let previous = null;
  const point = (event) => ({ x: event.clientX, y: event.clientY });
  const measure = () => {
    const [a, b] = [...pointers.values()];
    return { distance: Math.hypot(b.x - a.x, b.y - a.y), angle: Math.atan2(b.y - a.y, b.x - a.x) };
  };
  const down = (event) => {
    if (event.pointerType !== "touch") return;
    pointers.set(event.pointerId, point(event));
    previous = pointers.size === 2 ? measure() : null;
    element.setPointerCapture?.(event.pointerId);
  };
  const move = (event) => {
    if (!pointers.has(event.pointerId)) return;
    event.preventDefault();
    pointers.set(event.pointerId, point(event));
    if (pointers.size !== 2) return;
    const current = measure();
    if (previous?.distance > 0 && current.distance > 0) {
      onZoom(previous.distance / current.distance);
      onRotate(normalizeAngle(current.angle - previous.angle));
    }
    previous = current;
  };
  const end = (event) => {
    pointers.delete(event.pointerId);
    previous = pointers.size === 2 ? measure() : null;
  };
  element.addEventListener("pointerdown", down);
  element.addEventListener("pointermove", move, { passive: false });
  element.addEventListener("pointerup", end);
  element.addEventListener("pointercancel", end);
  return () => {
    element.removeEventListener("pointerdown", down);
    element.removeEventListener("pointermove", move);
    element.removeEventListener("pointerup", end);
    element.removeEventListener("pointercancel", end);
  };
}

function normalizeAngle(angle) {
  if (angle > Math.PI) return angle - 2 * Math.PI;
  if (angle < -Math.PI) return angle + 2 * Math.PI;
  return angle;
}
