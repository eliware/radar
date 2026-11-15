import { readAndRestoreLayerVisibility } from "./storage/read.mjs";
import { createLayerVisibilityChanges } from "./storage/changes.mjs";

export function createLayerVisibilityStorage(onChange, onReferenceChange) {
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
