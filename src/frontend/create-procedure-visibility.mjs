import { attachProcedureToggleKey } from "./attach-procedure-toggle-key.mjs";

export function createProcedureVisibility(documentRef, onChange = () => {}) {
  let sidVisible = true;
  let starVisible = true;
  const changed = () => onChange({ sidVisible, starVisible });
  const setSidVisible = (value) => ((sidVisible = Boolean(value)), changed());
  const setStarVisible = (value) => ((starVisible = Boolean(value)), changed());
  const detach = attachProcedureToggleKey(
    documentRef,
    () => setSidVisible(!sidVisible),
    () => setStarVisible(!starVisible),
  );
  return {
    isSidVisible: () => sidVisible,
    isStarVisible: () => starVisible,
    setSidVisible,
    setStarVisible,
    destroy: detach,
  };
}
