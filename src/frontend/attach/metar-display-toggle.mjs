const EDITABLE_TAGS = new Set(["input", "textarea", "select"]);

export function attachMetarDisplayToggle(documentRef, panel, onEnabledChange = () => {}) {
  if (!documentRef?.addEventListener || !panel) return () => {};
  const onKeyDown = (event) => {
    if (event.key?.toLowerCase() !== "m" || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (EDITABLE_TAGS.has(target?.tagName?.toLowerCase()) || target?.isContentEditable) return;
    event.preventDefault();
    panel.hidden = !panel.hidden;
    onEnabledChange(!panel.hidden);
  };
  documentRef.addEventListener("keydown", onKeyDown);
  return () => documentRef.removeEventListener?.("keydown", onKeyDown);
}
