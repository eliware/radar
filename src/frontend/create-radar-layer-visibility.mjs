import { createIlsVisibility } from "./create-ils-visibility.mjs";
import { createProcedureVisibility } from "./create-procedure-visibility.mjs";

export function createRadarLayerVisibility(documentRef, onChange) {
  const ils = createIlsVisibility(documentRef, onChange);
  const procedures = createProcedureVisibility(documentRef, onChange);
  return {
    ils,
    procedures,
    destroy() {
      ils.destroy();
      procedures.destroy();
    },
  };
}
