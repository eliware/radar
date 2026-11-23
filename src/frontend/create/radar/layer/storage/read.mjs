import { default as readSavedLayerVisibility } from "../visibility-persistence.mjs";
import { default as restoreLayerVisibility } from "../restore.mjs";

function readAndRestoreLayerVisibility(controllers, onReferenceChange) {
  restoreLayerVisibility(controllers, readSavedLayerVisibility(), onReferenceChange);
}
export default readAndRestoreLayerVisibility;
