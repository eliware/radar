const KEYS = { r: "runwaysVisible", e: "extensionsVisible", b: "baseLegsVisible" };
const EDITABLE = new Set(["input", "textarea", "select"]);

export function createRunwayVisibility(documentRef, onChange = () => {}) {
  const state = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true };
  const onKeyDown = (event) => {
    const layer = KEYS[event.key?.toLowerCase()];
    if (!layer || event.altKey || event.ctrlKey || event.metaKey) return;
    if (EDITABLE.has(event.target?.tagName?.toLowerCase()) || event.target?.isContentEditable)
      return;
    event.preventDefault();
    setVisible(layer, !state[layer]);
  };
  documentRef?.addEventListener?.("keydown", onKeyDown);
  function setVisible(layer, value) {
    if (!(layer in state)) return;
    state[layer] = Boolean(value);
    onChange({ ...state });
  }
  return {
    isRunwaysVisible: () => state.runwaysVisible,
    isExtensionsVisible: () => state.extensionsVisible,
    isBaseLegsVisible: () => state.baseLegsVisible,
    setVisible,
    setRunwaysVisible: (value) => setVisible("runwaysVisible", value),
    setExtensionsVisible: (value) => setVisible("extensionsVisible", value),
    setBaseLegsVisible: (value) => setVisible("baseLegsVisible", value),
    destroy: () => documentRef?.removeEventListener?.("keydown", onKeyDown),
  };
}
