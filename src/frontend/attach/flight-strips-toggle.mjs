const EDITABLE_TAGS = new Set(["input", "textarea", "select"]);

export function attachFlightStripsToggle(
  documentRef,
  dashboard,
  panel,
  onEnabledChange = () => {},
) {
  if (!documentRef?.addEventListener || !dashboard?.classList || !panel) return () => {};
  const syncLayout = () => dashboard.classList.toggle("flight-strips-hidden", panel.hidden);
  syncLayout();
  const onKeyDown = (event) => {
    if (event.key?.toLowerCase() !== "f" || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (EDITABLE_TAGS.has(target?.tagName?.toLowerCase()) || target?.isContentEditable) return;
    event.preventDefault();
    panel.hidden = !panel.hidden;
    syncLayout();
    onEnabledChange(!panel.hidden);
  };
  documentRef.addEventListener("keydown", onKeyDown);
  return () => documentRef.removeEventListener?.("keydown", onKeyDown);
}
