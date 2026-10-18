const EDITABLE_TAGS = new Set(["input", "textarea", "select"]);
const ZOOM_FACTOR = 1.2;
const ROTATION_STEP = Math.PI / 12;
const TILT_STEP = Math.PI / 36;

export function attachRadarArrowControls(documentRef, view) {
  if (!documentRef?.addEventListener) return () => {};
  const onKeyDown = (event) => {
    if (
      event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      ["ArrowUp", "ArrowDown"].includes(event.key) &&
      typeof view.tiltBy === "function"
    ) {
      event.preventDefault();
      view.tiltBy(event.key === "ArrowUp" ? TILT_STEP : -TILT_STEP);
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (EDITABLE_TAGS.has(target?.tagName?.toLowerCase()) || target?.isContentEditable) return;
    const action = {
      ArrowUp: () => view.zoomBy(1 / ZOOM_FACTOR),
      ArrowDown: () => view.zoomBy(ZOOM_FACTOR),
      ArrowLeft: () => view.rotateBy(-ROTATION_STEP),
      ArrowRight: () => view.rotateBy(ROTATION_STEP),
    }[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };
  documentRef.addEventListener("keydown", onKeyDown);
  return () => documentRef.removeEventListener?.("keydown", onKeyDown);
}
