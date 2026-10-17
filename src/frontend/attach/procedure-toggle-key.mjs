const EDITABLE_TAGS = new Set(["input", "textarea", "select"]);

export function attachProcedureToggleKey(documentRef, toggleSid, toggleStar) {
  if (!documentRef?.addEventListener) return () => {};
  const onKeyDown = (event) => {
    const key = event.key?.toLowerCase();
    if (!["d", "s"].includes(key) || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (EDITABLE_TAGS.has(target?.tagName?.toLowerCase()) || target?.isContentEditable) return;
    event.preventDefault();
    (key === "d" ? toggleSid : toggleStar)();
  };
  documentRef.addEventListener("keydown", onKeyDown);
  return () => documentRef.removeEventListener?.("keydown", onKeyDown);
}
