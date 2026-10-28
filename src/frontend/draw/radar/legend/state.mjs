export function createRadarLegendState(
  ilsVisible,
  procedureVisibility,
  waterVisible,
  airwayVisibility,
  runwayVisibility,
  referenceVisibility,
) {
  const procedures =
    typeof procedureVisibility === "boolean"
      ? { sidVisible: procedureVisibility, starVisible: procedureVisibility }
      : procedureVisibility;
  return {
    ilsVisible,
    ...procedures,
    airwayQVisible: airwayVisibility.Q,
    airwayJVisible: airwayVisibility.J,
    airwayVVisible: airwayVisibility.V,
    ...runwayVisibility,
    airportVisible: referenceVisibility.airportsVisible,
    navaidsVisible: referenceVisibility.navaidsVisible,
    waterVisible,
  };
}
