import { createIlsVisibility } from "./create-ils-visibility.mjs";
import { createProcedureVisibility } from "./create-procedure-visibility.mjs";
import { createAirwayVisibility } from "./create-airway-visibility.mjs";
import { createRunwayVisibility } from "./create-runway-visibility.mjs";
import { createReferenceVisibility } from "./create-reference-visibility.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  const ils = createIlsVisibility(documentRef, onChange);
  const procedures = createProcedureVisibility(documentRef, onChange);
  const airways = createAirwayVisibility(documentRef, onChange);
  const runways = createRunwayVisibility(documentRef, onChange);
  const references = createReferenceVisibility(documentRef, onReferenceChange ?? onChange);
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
