import { default as readAndRestoreLayerVisibility } from "./storage/read.mjs";
import { default as createLayerVisibilityChanges } from "./storage/changes.mjs";

function createLayerVisibilityStorage(onChange, onReferenceChange) {
  const changes = createLayerVisibilityChanges(onChange, onReferenceChange);
  return {
    ils: changes.ils,
    procedures: changes.procedures,
    airways: changes.airways,
    runways: changes.runways,
    references: changes.references,
    restore(controllers) {
      readAndRestoreLayerVisibility(controllers, onReferenceChange);
      changes.finishRestore();
    },
  };
}
export default createLayerVisibilityStorage;
