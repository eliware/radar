import { writeToggleState } from "../../../write-toggle-state.mjs";

export function persistLayerVisibility(key, visible) {
  writeToggleState(key, visible);
}
