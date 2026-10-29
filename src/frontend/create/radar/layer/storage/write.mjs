import { persistLayerVisibility } from "../persist-visibility.mjs";

export function persistLayerVisibilityChanges(changes) {
  for (const [key, visible] of Object.entries(changes)) persistLayerVisibility(key, visible);
}
