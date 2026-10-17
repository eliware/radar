import { attachWaterToggleKey } from "./attach-water-toggle-key.mjs";
import { readToggleState, writeToggleState } from "./toggle-state-storage.mjs";

export function createWaterVisibility(documentRef, onChange = () => {}) {
  let visible = readToggleState("water");
  const detach = attachWaterToggleKey(documentRef, () => {
    visible = !visible;
    writeToggleState("water", visible);
    onChange(visible);
  });
  return { isVisible: () => visible, destroy: detach };
}
