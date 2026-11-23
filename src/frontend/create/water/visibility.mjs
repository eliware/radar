import { default as attachWaterToggleKey } from "../../attach/water-toggle-key.mjs";
import { default as readToggleState } from "../../toggle-state-storage.mjs";
import { default as writeToggleState } from "../../write-toggle-state.mjs";

function createWaterVisibility(documentRef, onChange = () => {}) {
  let visible = readToggleState("water");
  const detach = attachWaterToggleKey(documentRef, () => {
    visible = !visible;
    writeToggleState("water", visible);
    onChange(visible);
  });
  return { isVisible: () => visible, destroy: detach };
}
export default createWaterVisibility;
