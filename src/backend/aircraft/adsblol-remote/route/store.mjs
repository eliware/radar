import { createAdsbLolRouteEnrichment } from "./enrichment.mjs";

export function createAdsbLolRouteStore({ tracks, lookup, onRouteUpdate }) {
  const enrichment = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });

  return {
    update(record) {
      const mapped = tracks.update(record);
      if (mapped) enrichment.enrich(mapped, tracks);
    },
    setEnabled: enrichment.setEnabled,
  };
}
