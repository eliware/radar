export function createRadarReferenceStore() {
  const airports = new Map();
  const navaids = new Map();
  const boundaries = new Map();
  const ilsApproaches = new Map();
  const procedures = new Map();
  const airways = new Map();
  const updates = (onAirports = () => {}, onChange = () => {}) => ({
    updateAirports(items) {
      airports.clear();
      for (const item of items) airports.set(item.faaId, item);
      onAirports(items);
      onChange();
    },
    updateNavaids(items) {
      navaids.clear();
      for (const item of items) navaids.set(`${item.state}:${item.identifier}`, item);
      onChange();
    },
    updateBoundaries(items) {
      boundaries.clear();
      for (const item of items) boundaries.set(item.id, item);
      onChange();
    },
    updateIls(items) {
      ilsApproaches.clear();
      for (const item of items) ilsApproaches.set(`${item.faaId}:${item.runwayEnd}`, item);
      onChange();
    },
    updateProcedures(items) {
      procedures.clear();
      for (const item of items) procedures.set(item.id, item);
      onChange();
    },
    updateAirways(items) {
      airways.clear();
      for (const item of items) airways.set(item.id, item);
      onChange();
    },
    updateAll(collections) {
      const [airportItems, navaidItems, boundaryItems, ilsItems, procedureItems, airwayItems] =
        collections;
      replace(airports, airportItems, (item) => item.faaId);
      replace(navaids, navaidItems, (item) => `${item.state}:${item.identifier}`);
      replace(boundaries, boundaryItems, (item) => item.id);
      replace(ilsApproaches, ilsItems, (item) => `${item.faaId}:${item.runwayEnd}`);
      replace(procedures, procedureItems, (item) => item.id);
      replace(airways, airwayItems, (item) => item.id);
      onAirports(airportItems);
      onChange();
    },
  });
  return {
    airports,
    navaids,
    boundaries,
    ilsApproaches,
    procedures,
    airways,
    ...updates(),
    updates,
  };
}

function replace(map, items, identity) {
  map.clear();
  for (const item of items) map.set(identity(item), item);
}
