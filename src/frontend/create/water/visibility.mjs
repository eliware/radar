import { attachWaterToggleKey } from "../../attach/water-toggle-key.mjs";
import { readToggleState } from "../../toggle-state-storage.mjs";
import { writeToggleState } from "../../write-toggle-state.mjs";

export function createWaterVisibility(documentRef, onChange = () => {}) {
  let visible = readToggleState("water");
  const detach = attachWaterToggleKey(documentRef, () => {
    visible = !visible;
    writeToggleState("water", visible);
    onChange(visible);
  });
  return { isVisible: () => visible, destroy: detach };
}
