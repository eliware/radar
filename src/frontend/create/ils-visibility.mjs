import { default as attachIlsToggleKey } from "../attach/ils-toggle-key.mjs";

function createIlsVisibility(documentRef, onChange = () => {}) {
  let visible = true;
  const detach = attachIlsToggleKey(documentRef, () => {
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
export default createIlsVisibility;
