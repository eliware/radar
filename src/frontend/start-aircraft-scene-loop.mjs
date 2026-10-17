import { createAircraftRadarLoop } from "./create-aircraft-radar-loop.mjs";

export function startAircraftSceneLoop(options, createLoop = createAircraftRadarLoop) {
  return createLoop({
    ...options,
    isIlsVisible: options.layers.ils.isVisible,
    procedureVisibility: {
      get sidVisible() {
        return options.layers.procedures.isSidVisible();
      },
      get starVisible() {
        return options.layers.procedures.isStarVisible();
      },
    },
    airwayVisibility: options.layers.airways,
    runwayVisibility: options.layers.runways,
    referenceVisibility: {
      get airportsVisible() {
        return options.layers.references.isAirportsVisible();
      },
      get navaidsVisible() {
        return options.layers.references.isNavaidsVisible();
      },
    },
    isWaterVisible: options.water.isVisible,
    airports: options.references.airports,
    navaids: options.references.navaids,
    boundaries: options.references.boundaries,
    ilsApproaches: options.references.ilsApproaches,
    procedures: options.references.procedures,
    airways: options.references.airways,
  });
}
