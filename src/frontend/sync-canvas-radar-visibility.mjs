export function syncCanvasRadarVisibility(state, layers) {
  state.ilsVisible = layers.ils.isVisible();
  state.sidVisible = layers.procedures.isSidVisible();
  state.starVisible = layers.procedures.isStarVisible();
  state.airwayVisibility = Object.fromEntries(
    ["Q", "J", "V"].map((type) => [type, layers.airways.isVisible(type)]),
  );
  state.runwaysVisible = layers.runways.isRunwaysVisible();
  state.extensionsVisible = layers.runways.isExtensionsVisible();
  state.airportsVisible = layers.references.isAirportsVisible();
  state.navaidsVisible = layers.references.isNavaidsVisible();
}
