function createRadarReferenceLayers() {
  return [
    ["airports", "updateAirports", 35, (item) => item.faaId],
    ["navaids", "updateNavaids", 1, (item) => `${item.state}:${item.identifier}`],
    ["boundaries", "updateBoundaries", 0, (item) => item.id],
    ["ils", "updateIls", 35, (item) => `${item.faaId}:${item.runwayEnd}`],
    ["procedures", "updateProcedures", 35, (item) => item.id],
    ["airways", "updateAirways", 0, (item) => item.id],
  ];
}
export default createRadarReferenceLayers;
