import { attachProcedureToggleKey } from "./attach-procedure-toggle-key.mjs";

export function createProcedureVisibility(documentRef, onChange = () => {}) {
  let visible = true;
  const detach = attachProcedureToggleKey(documentRef, () => {
    visible = !visible;
    onChange(visible);
  });
  return {
    isVisible: () => visible,
    setVisible(value) {
      visible = Boolean(value);
      onChange(visible);
    },
    destroy: detach,
  };
}
