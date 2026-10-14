import { attachWaterToggleKey } from "./attach-water-toggle-key.mjs";

export function createWaterVisibility(documentRef, onChange = () => {}) {
  let visible = true;
  const detach = attachWaterToggleKey(documentRef, () => {
    visible = !visible;
    onChange(visible);
  });
  return { isVisible: () => visible, destroy: detach };
}
