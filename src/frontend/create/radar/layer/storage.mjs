import { persistLayerVisibility } from "./persist-visibility.mjs";
import { readSavedLayerVisibility } from "./visibility-persistence.mjs";
import { restoreLayerVisibility } from "./restore.mjs";

export function createLayerVisibilityStorage(onChange, onReferenceChange) {
  let restoring = true;
  function changed(key, value, callback = onChange) {
    if (restoring) return;
    persistLayerVisibility(key, value);
    callback?.(value);
  }
  return {
    ils: (value) => changed("ils", value),
    procedures(value) {
      if (restoring) return;
      persistLayerVisibility("sid", value.sidVisible);
      persistLayerVisibility("star", value.starVisible);
      onChange?.(value);
    },
    airways(value) {
      if (restoring) return;
      Object.entries(value).forEach(([type, visible]) =>
        persistLayerVisibility(`airway-${type}`, visible),
      );
      onChange?.(value);
    },
    runways(value) {
      if (restoring) return;
      persistLayerVisibility("runways", value.runwaysVisible);
      persistLayerVisibility("extensions", value.extensionsVisible);
      persistLayerVisibility("baseLegs", value.baseLegsVisible);
      onChange?.(value);
    },
    references(value) {
      if (restoring) return;
      persistLayerVisibility("airports", value.airportsVisible);
      persistLayerVisibility("navaids", value.navaidsVisible);
      (onReferenceChange ?? onChange)?.(value);
    },
    restore(controllers) {
      const saved = readSavedLayerVisibility();
      restoreLayerVisibility(controllers, saved, onReferenceChange);
      restoring = false;
    },
  };
}
