import { readSavedLayerVisibility } from "../visibility-persistence.mjs";
import { restoreLayerVisibility } from "../restore.mjs";

export function readAndRestoreLayerVisibility(controllers, onReferenceChange) {
  restoreLayerVisibility(controllers, readSavedLayerVisibility(), onReferenceChange);
}
