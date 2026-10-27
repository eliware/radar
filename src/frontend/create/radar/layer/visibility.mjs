import { createIlsVisibility } from "../../ils-visibility.mjs";
import { createProcedureVisibility } from "../../procedure-visibility.mjs";
import { createAirwayVisibility } from "../../airway-visibility.mjs";
import { createRunwayVisibility } from "../../runway-visibility.mjs";
import { createReferenceVisibility } from "../../reference-visibility.mjs";
import { createAircraftVisibility } from "../../aircraft-visibility.mjs";
import { createLayerVisibilityRestore } from "./restore.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  const restore = createLayerVisibilityRestore(onChange, onReferenceChange);
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
