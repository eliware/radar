import { findRadarLegendToggle } from "../draw/radar/legend/entries.mjs";

export function attachRadarLegendClick(element, documentRef, windowRef, redraw, topInset = 0) {
  if (
    !element?.addEventListener ||
    !documentRef?.dispatchEvent ||
    !documentRef?.addEventListener ||
    !windowRef?.KeyboardEvent
  )
    return () => {};
  const onClick = (event) => {
    const rect = element.getBoundingClientRect();
    const width = element.clientWidth || rect.width;
    const height = element.clientHeight || rect.height;
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) * width) / rect.width;
    const y = ((event.clientY - rect.top) * height) / rect.height;
    const key = findRadarLegendToggle(width, height, x, y, topInset);
    if (!key) return;
    documentRef.dispatchEvent(
      new windowRef.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    );
  };
  const onKeyDown = (event) => {
    if (["m", "f"].includes(event.key?.toLowerCase())) redraw?.();
  };
  element.addEventListener("click", onClick);
  documentRef.addEventListener("keydown", onKeyDown);
  return () => {
    element.removeEventListener("click", onClick);
    documentRef.removeEventListener("keydown", onKeyDown);
  };
}
