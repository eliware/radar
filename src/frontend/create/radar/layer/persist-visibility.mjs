import { default as writeToggleState } from "../../../write-toggle-state.mjs";

function persistLayerVisibility(key, visible) {
  writeToggleState(key, visible);
}
export default persistLayerVisibility;
