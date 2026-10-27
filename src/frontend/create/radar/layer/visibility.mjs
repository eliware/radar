import { createIlsVisibility } from "../../ils-visibility.mjs";
import { createProcedureVisibility } from "../../procedure-visibility.mjs";
import { createAirwayVisibility } from "../../airway-visibility.mjs";
import { createRunwayVisibility } from "../../runway-visibility.mjs";
import { createReferenceVisibility } from "../../reference-visibility.mjs";
import { createAircraftVisibility } from "../../aircraft-visibility.mjs";
import { persistLayerVisibility, readSavedLayerVisibility } from "./visibility-persistence.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  let restoring = true;
  function changed(key, value, callback = onChange) {
    if (restoring) return;
    persistLayerVisibility(key, value);
    callback?.(value);
  }
  const restore = {
    ils: (value) => changed("ils", value),
    procedures(value) {
      if (restoring) return;
      persistLayerVisibility("sid", value.sidVisible);
      persistLayerVisibility("star", value.starVisible);
      onChange?.(value);
    },
    airways(value) {
      if (restoring) return;
      Object.entries(value).forEach(([type, visible]) => persistLayerVisibility(`airway-${type}`, visible));
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
      ["Q", "J", "V"].forEach((type) => controllers.airways.setVisible(type, saved[`airway-${type}`]));
      controllers.runways.setRunwaysVisible(saved.runways);
      controllers.runways.setExtensionsVisible(saved.extensions);
      controllers.runways.setBaseLegsVisible(saved.baseLegs);
      controllers.references.setAirportsVisible(saved.airports);
      controllers.references.setNavaidsVisible(saved.navaids);
      restoring = false;
      onReferenceChange?.({ airportsVisible: saved.airports, navaidsVisible: saved.navaids });
    },
  };
  const aircraft = createAircraftVisibility(documentRef);
  const ils = createIlsVisibility(documentRef, restore.ils);
  const procedures = createProcedureVisibility(documentRef, restore.procedures);
  const airways = createAirwayVisibility(documentRef, restore.airways);
  const runways = createRunwayVisibility(documentRef, restore.runways);
  const references = createReferenceVisibility(documentRef, restore.references);
  restore.restore({ ils, procedures, airways, runways, references });
  return {
    ils,
    procedures,
    airways,
    runways,
    references,
    aircraft,
    destroy() {
      ils.destroy();
      procedures.destroy();
      airways.destroy();
      runways.destroy();
      references.destroy();
      aircraft.destroy();
    },
  };
}
