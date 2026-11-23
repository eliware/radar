import { default as findRadarLegendToggle } from "../../draw/radar/legend/hit-test.mjs";

function attachRadarLegendClick(element, documentRef, windowRef, topInset = 0) {
  if (!element?.addEventListener || !documentRef?.dispatchEvent || !windowRef?.KeyboardEvent)
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
  element.addEventListener("click", onClick);
  return () => {
    element.removeEventListener("click", onClick);
  };
}
export default attachRadarLegendClick;
