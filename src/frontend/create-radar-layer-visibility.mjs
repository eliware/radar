import { createIlsVisibility } from "./create-ils-visibility.mjs";
import { createProcedureVisibility } from "./create-procedure-visibility.mjs";
import { createAirwayVisibility } from "./create-airway-visibility.mjs";
import { createRunwayVisibility } from "./create-runway-visibility.mjs";
import { createReferenceVisibility } from "./create-reference-visibility.mjs";
import { readToggleState, writeToggleState } from "./toggle-state-storage.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  let restoring = true;
  const saved = Object.fromEntries(
    [
      "ils",
      "sid",
      "star",
      "airway-Q",
      "airway-J",
      "airway-V",
      "runways",
      "extensions",
      "airports",
      "navaids",
    ].map((key) => [key, readToggleState(key)]),
  );
  const ils = createIlsVisibility(documentRef, (value) => {
    if (!restoring) changed("ils", value, onChange);
  });
  const procedures = createProcedureVisibility(documentRef, (value) => {
    if (restoring) return;
    writeToggleState("sid", value.sidVisible);
    writeToggleState("star", value.starVisible);
    onChange?.(value);
  });
  const airways = createAirwayVisibility(documentRef, (value) => {
    if (restoring) return;
    Object.entries(value).forEach(([type, visible]) => writeToggleState(`airway-${type}`, visible));
    onChange?.(value);
  });
  const runways = createRunwayVisibility(documentRef, (value) => {
    if (restoring) return;
    writeToggleState("runways", value.runwaysVisible);
    writeToggleState("extensions", value.extensionsVisible);
    onChange?.(value);
  });
  const references = createReferenceVisibility(documentRef, (value) => {
    if (restoring) return;
    writeToggleState("airports", value.airportsVisible);
    writeToggleState("navaids", value.navaidsVisible);
    (onReferenceChange ?? onChange)?.(value);
  });
  ils.setVisible(saved.ils);
  procedures.setSidVisible(saved.sid);
  procedures.setStarVisible(saved.star);
  ["Q", "J", "V"].forEach((type) => airways.setVisible(type, saved[`airway-${type}`]));
  runways.setRunwaysVisible(saved.runways);
  runways.setExtensionsVisible(saved.extensions);
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
    destroy() {
      ils.destroy();
      procedures.destroy();
      airways.destroy();
      runways.destroy();
      references.destroy();
    },
  };
}

function changed(key, value, onChange) {
  writeToggleState(key, value);
  onChange?.(value);
}
