const EDITABLE_TAGS = new Set(["input", "textarea", "select"]);

export function attachWaterToggleKey(documentRef, toggle) {
  if (!documentRef?.addEventListener) return () => {};
  const onKeyDown = (event) => {
    if (event.key?.toLowerCase() !== "w" || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (EDITABLE_TAGS.has(target?.tagName?.toLowerCase()) || target?.isContentEditable) return;
    event.preventDefault();
    toggle();
  };
  documentRef.addEventListener("keydown", onKeyDown);
  return () => documentRef.removeEventListener?.("keydown", onKeyDown);
}
