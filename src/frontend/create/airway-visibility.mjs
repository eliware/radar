const KEYS = { q: "Q", j: "J", v: "V" };
const EDITABLE = new Set(["input", "textarea", "select"]);

export function createAirwayVisibility(documentRef, onChange = () => {}) {
  const visible = { Q: true, J: true, V: true };
  const onKeyDown = (event) => {
    const type = KEYS[event.key?.toLowerCase()];
    if (!type || event.altKey || event.ctrlKey || event.metaKey) return;
    if (EDITABLE.has(event.target?.tagName?.toLowerCase()) || event.target?.isContentEditable)
      return;
    event.preventDefault();
    setVisible(type, !visible[type]);
  };
  documentRef?.addEventListener?.("keydown", onKeyDown);
  function setVisible(type, value) {
    if (!(type in visible)) return;
    visible[type] = Boolean(value);
    onChange({ ...visible });
  }
  return {
    isVisible: (type) => Boolean(visible[type]),
    setVisible,
    destroy: () => documentRef?.removeEventListener?.("keydown", onKeyDown),
  };
}
