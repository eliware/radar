const KEYS = { a: "airportsVisible", n: "navaidsVisible" };
const EDITABLE = new Set(["input", "textarea", "select"]);

export function createReferenceVisibility(documentRef, onChange = () => {}) {
  const state = { airportsVisible: true, navaidsVisible: true };
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
    isAirportsVisible: () => state.airportsVisible,
    isNavaidsVisible: () => state.navaidsVisible,
    setVisible,
    setAirportsVisible: (value) => setVisible("airportsVisible", value),
    setNavaidsVisible: (value) => setVisible("navaidsVisible", value),
    destroy: () => documentRef?.removeEventListener?.("keydown", onKeyDown),
  };
}
