import { default as persistLayerVisibility } from "../persist-visibility.mjs";

function persistLayerVisibilityChanges(changes) {
  for (const [key, visible] of Object.entries(changes)) persistLayerVisibility(key, visible);
}
export default persistLayerVisibilityChanges;
