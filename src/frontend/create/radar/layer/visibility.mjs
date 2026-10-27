import { createIlsVisibility } from "../../ils-visibility.mjs";
import { createProcedureVisibility } from "../../procedure-visibility.mjs";
import { createAirwayVisibility } from "../../airway-visibility.mjs";
import { createRunwayVisibility } from "../../runway-visibility.mjs";
import { createReferenceVisibility } from "../../reference-visibility.mjs";
import { createAircraftVisibility } from "../../aircraft-visibility.mjs";
import { persistLayerVisibility, readSavedLayerVisibility } from "./visibility-persistence.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  let restoring = true;
  const saved = readSavedLayerVisibility();
  const aircraft = createAircraftVisibility(documentRef);
  const ils = createIlsVisibility(documentRef, (value) => {
    if (!restoring) changed("ils", value, onChange);
  });
  const procedures = createProcedureVisibility(documentRef, (value) => {
    if (restoring) return;
    persistLayerVisibility("sid", value.sidVisible);
    persistLayerVisibility("star", value.starVisible);
    onChange?.(value);
  });
  const airways = createAirwayVisibility(documentRef, (value) => {
    if (restoring) return;
    Object.entries(value).forEach(([type, visible]) =>
      persistLayerVisibility(`airway-${type}`, visible),
    );
    onChange?.(value);
  });
  const runways = createRunwayVisibility(documentRef, (value) => {
    if (restoring) return;
    persistLayerVisibility("runways", value.runwaysVisible);
    persistLayerVisibility("extensions", value.extensionsVisible);
    persistLayerVisibility("baseLegs", value.baseLegsVisible);
    onChange?.(value);
  });
  const references = createReferenceVisibility(documentRef, (value) => {
    if (restoring) return;
    persistLayerVisibility("airports", value.airportsVisible);
    persistLayerVisibility("navaids", value.navaidsVisible);
    (onReferenceChange ?? onChange)?.(value);
  });
  ils.setVisible(saved.ils);
  procedures.setSidVisible(saved.sid);
  procedures.setStarVisible(saved.star);
  ["Q", "J", "V"].forEach((type) => airways.setVisible(type, saved[`airway-${type}`]));
  runways.setRunwaysVisible(saved.runways);
  runways.setExtensionsVisible(saved.extensions);
  runways.setBaseLegsVisible(saved.baseLegs);
  references.setAirportsVisible(saved.airports);
  references.setNavaidsVisible(saved.navaids);
  restoring = false;
  onReferenceChange?.({ airportsVisible: saved.airports, navaidsVisible: saved.navaids });
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

function changed(key, value, onChange) {
  persistLayerVisibility(key, value);
  onChange?.(value);
}
