import { createAdsbLolRouteEnrichment } from "./route/enrichment.mjs";
import { createAdsbLolTrackStore } from "./track-store.mjs";

export function createAdsbLolAircraftStore({
  location,
  lookup,
  clock = Date.now,
  onRouteUpdate = () => {},
}) {
  const tracks = createAdsbLolTrackStore({ location, clock });
  const routes = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });

  function update(record) {
    const mapped = tracks.update(record);
    if (mapped) routes.enrich(mapped, tracks);
  }

  return {
    list: tracks.list,
    update,
    clear: tracks.clear,
    setRouteLookupsEnabled: routes.setEnabled,
  };
}
