import { createIlsVisibility } from "../../ils-visibility.mjs";
import { createProcedureVisibility } from "../../procedure-visibility.mjs";
import { createAirwayVisibility } from "../../airway-visibility.mjs";
import { createRunwayVisibility } from "../../runway-visibility.mjs";
import { createReferenceVisibility } from "../../reference-visibility.mjs";
import { createAircraftVisibility } from "../../aircraft-visibility.mjs";
import { createLayerVisibilityStorage } from "./storage.mjs";
import { attachRadarLayerShortcuts } from "./shortcuts.mjs";

export function createRadarLayerVisibility(documentRef, onChange, onReferenceChange) {
  const persistence = createLayerVisibilityStorage(onChange, onReferenceChange);
  const aircraft = createAircraftVisibility(documentRef);
  const ils = createIlsVisibility(documentRef, persistence.ils);
  const procedures = createProcedureVisibility(documentRef, persistence.procedures);
  const airways = createAirwayVisibility(persistence.airways);
  const runways = createRunwayVisibility(persistence.runways);
  const references = createReferenceVisibility(persistence.references);
  const detachShortcuts = attachRadarLayerShortcuts(documentRef, { airways, references, runways });
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
      detachShortcuts();
      aircraft.destroy();
    },
  };
}
