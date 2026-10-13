export function createWaterLayerControl(documentRef, onChange) {
  const button =
    typeof documentRef?.querySelector === "function"
      ? documentRef.querySelector("[data-water-toggle]")
      : null;
  if (!button) return { isVisible: () => true, destroy: () => {} };
  let visible = true;
  const update = () => {
    button.setAttribute("aria-pressed", String(visible));
    button.textContent = visible ? "WATER ON" : "WATER OFF";
    onChange(visible);
  };
  const click = () => {
    visible = !visible;
    update();
  };
  button.addEventListener("click", click);
  update();
  return {
    isVisible: () => visible,
    destroy: () => button.removeEventListener("click", click),
  };
}
