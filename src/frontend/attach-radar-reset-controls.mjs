const EDITABLE_TAGS = new Set(["input", "textarea", "select"]);

export function attachRadarResetControls(documentRef, view) {
  const compass = documentRef?.querySelector?.("[data-radar-compass]");
  const reset = () => view.reset();
  const onKeyDown = (event) => {
    if (event.key?.toLowerCase() !== "r" || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (EDITABLE_TAGS.has(target?.tagName?.toLowerCase()) || target?.isContentEditable) return;
    event.preventDefault();
    reset();
  };
  const onCompassKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    reset();
  };
  documentRef?.addEventListener?.("keydown", onKeyDown);
  compass?.addEventListener?.("click", reset);
  compass?.addEventListener?.("keydown", onCompassKeyDown);
  return () => {
    documentRef?.removeEventListener?.("keydown", onKeyDown);
    compass?.removeEventListener?.("click", reset);
    compass?.removeEventListener?.("keydown", onCompassKeyDown);
  };
}
