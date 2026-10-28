export function reconcileAircraftSource(entries, source, items, setSourceItem) {
  const current = new Set();
  for (const item of items) {
    const icao = setSourceItem(source, item);
    if (icao) current.add(icao);
  }
  for (const [icao, entry] of entries) {
    if (!current.has(icao)) delete entry[source];
    if (!entry.local && !entry.remote) entries.delete(icao);
  }
}
