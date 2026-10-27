import { createIlsVisibility } from "../../ils-visibility.mjs";
import { createProcedureVisibility } from "../../procedure-visibility.mjs";
import { createAirwayVisibility } from "../../airway-visibility.mjs";
import { createRunwayVisibility } from "../../runway-visibility.mjs";
import { createReferenceVisibility } from "../../reference-visibility.mjs";
import { createAircraftVisibility } from "../../aircraft-visibility.mjs";
import { createLayerVisibilityPersistence } from "./persistence.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  const persistence = createLayerVisibilityPersistence(onChange, onReferenceChange);
  const aircraft = createAircraftVisibility(documentRef);
  const ils = createIlsVisibility(documentRef, persistence.ils);
  const procedures = createProcedureVisibility(documentRef, persistence.procedures);
  const airways = createAirwayVisibility(documentRef, persistence.airways);
  const runways = createRunwayVisibility(documentRef, persistence.runways);
  const references = createReferenceVisibility(documentRef, persistence.references);
  persistence.restore({ ils, procedures, airways, runways, references });
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
