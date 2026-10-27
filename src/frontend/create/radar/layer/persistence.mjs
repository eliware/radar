import { persistLayerVisibility, readSavedLayerVisibility } from "./visibility-persistence.mjs";

export function createLayerVisibilityPersistence(onChange, onReferenceChange) {
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
      controllers.ils.setVisible(saved.ils);
      controllers.procedures.setSidVisible(saved.sid);
      controllers.procedures.setStarVisible(saved.star);
      ["Q", "J", "V"].forEach((type) =>
        controllers.airways.setVisible(type, saved[`airway-${type}`]),
      );
      controllers.runways.setRunwaysVisible(saved.runways);
      controllers.runways.setExtensionsVisible(saved.extensions);
      controllers.runways.setBaseLegsVisible(saved.baseLegs);
      controllers.references.setAirportsVisible(saved.airports);
      controllers.references.setNavaidsVisible(saved.navaids);
      restoring = false;
      onReferenceChange?.({ airportsVisible: saved.airports, navaidsVisible: saved.navaids });
    },
  };
}
