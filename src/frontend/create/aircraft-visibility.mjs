import { readToggleState } from "../toggle-state-storage.mjs";
import { writeToggleState } from "../write-toggle-state.mjs";

export function createAircraftVisibility(documentRef, onChange = () => {}) {
  let remoteVisible = readToggleState("remote-aircraft");
  const onKeyDown = (event) => {
    if (event.key?.toLowerCase() !== "l" || event.altKey || event.ctrlKey || event.metaKey) return;
    if (["input", "textarea", "select"].includes(event.target?.tagName?.toLowerCase())) return;
    if (event.target?.isContentEditable) return;
    event.preventDefault();
    setLocalOnly(remoteVisible);
  };
  documentRef?.addEventListener?.("keydown", onKeyDown);
  function setLocalOnly(value) {
    remoteVisible = !value;
    writeToggleState("remote-aircraft", remoteVisible);
    onChange({ localOnly: !remoteVisible });
  }
  return {
    isLocalOnly: () => !remoteVisible,
    setLocalOnly,
    destroy: () => documentRef?.removeEventListener?.("keydown", onKeyDown),
  };
}
