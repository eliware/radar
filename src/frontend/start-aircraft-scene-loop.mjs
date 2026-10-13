import { createAircraftRadarLoop } from "./create-aircraft-radar-loop.mjs";

export function startAircraftSceneLoop(options, createLoop = createAircraftRadarLoop) {
  return createLoop({
    ...options,
    isIlsVisible: options.ils.isVisible,
    isProceduresVisible: options.procedures.isVisible,
    airports: options.references.airports,
    navaids: options.references.navaids,
    boundaries: options.references.boundaries,
    ilsApproaches: options.references.ilsApproaches,
    procedures: options.references.procedures,
  });
}
