export function restoreLayerVisibility(controllers, saved, onReferenceChange) {
  controllers.ils.setVisible(saved.ils);
  controllers.procedures.setSidVisible(saved.sid);
  controllers.procedures.setStarVisible(saved.star);
  ["Q", "J", "V"].forEach((type) => controllers.airways.setVisible(type, saved[`airway-${type}`]));
  controllers.runways.setRunwaysVisible(saved.runways);
  controllers.runways.setExtensionsVisible(saved.extensions);
  controllers.runways.setBaseLegsVisible(saved.baseLegs);
  controllers.references.setAirportsVisible(saved.airports);
  controllers.references.setNavaidsVisible(saved.navaids);
  onReferenceChange?.({ airportsVisible: saved.airports, navaidsVisible: saved.navaids });
}
