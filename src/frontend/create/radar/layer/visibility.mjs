import { default as createIlsVisibility } from "../../ils-visibility.mjs";
import { default as createProcedureVisibility } from "../../procedure-visibility.mjs";
import { default as createAirwayVisibility } from "./airways.mjs";
import { default as createRunwayVisibility } from "./runways.mjs";
import { default as createReferenceVisibility } from "./references.mjs";
import { default as createAircraftVisibility } from "../../aircraft-visibility.mjs";
import { default as createLayerVisibilityStorage } from "./storage.mjs";
import { default as attachRadarLayerShortcuts } from "./shortcuts.mjs";
import { default as disposeRadarLayerVisibility } from "./dispose.mjs";

function createRadarLayerVisibility(documentRef, onChange, onReferenceChange, onLocalOnlyChange) {
  const persistence = createLayerVisibilityStorage(onChange, onReferenceChange);
  const aircraft = createAircraftVisibility(documentRef, onLocalOnlyChange);
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
      disposeRadarLayerVisibility({ ils, procedures, aircraft, detachShortcuts });
    },
  };
}
export default createRadarLayerVisibility;
