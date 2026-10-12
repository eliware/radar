export function createRadarReferenceStore() {
  const airports = new Map();
  const navaids = new Map();
  const boundaries = new Map();
  const updates = (onAirports = () => {}) => ({
    updateAirports(items) {
      for (const item of items) airports.set(item.faaId, item);
      onAirports(items);
    },
    updateNavaids(items) {
      for (const item of items) navaids.set(`${item.state}:${item.identifier}`, item);
    },
    updateBoundaries(items) {
      for (const item of items) boundaries.set(item.id, item);
    },
  });
  return {
    airports,
    navaids,
    boundaries,
    ...updates(),
    updates,
  };
}
