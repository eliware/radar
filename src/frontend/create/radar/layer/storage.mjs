import { readAndRestoreLayerVisibility } from "./storage/read.mjs";
import { persistLayerVisibilityChanges } from "./storage/write.mjs";

export function createLayerVisibilityStorage(onChange, onReferenceChange) {
  let restoring = true;
  function changed(key, value, callback = onChange) {
    if (restoring) return;
    persistLayerVisibilityChanges({ [key]: value });
    callback?.(value);
  }
  return {
    ils: (value) => changed("ils", value),
    procedures(value) {
      if (restoring) return;
      persistLayerVisibilityChanges({ sid: value.sidVisible, star: value.starVisible });
      onChange?.(value);
    },
    airways(value) {
      if (restoring) return;
      persistLayerVisibilityChanges(
        Object.fromEntries(
          Object.entries(value).map(([type, visible]) => [`airway-${type}`, visible]),
        ),
      );
      onChange?.(value);
    },
    runways(value) {
      if (restoring) return;
      persistLayerVisibilityChanges({
        runways: value.runwaysVisible,
        extensions: value.extensionsVisible,
        baseLegs: value.baseLegsVisible,
      });
      onChange?.(value);
    },
    references(value) {
      if (restoring) return;
      persistLayerVisibilityChanges({
        airports: value.airportsVisible,
        navaids: value.navaidsVisible,
      });
      (onReferenceChange ?? onChange)?.(value);
    },
    restore(controllers) {
      readAndRestoreLayerVisibility(controllers, onReferenceChange);
      restoring = false;
    },
  };
}
