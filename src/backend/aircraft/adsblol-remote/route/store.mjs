import { default as createAdsbLolRouteEnrichment } from "./enrichment.mjs";

function createAdsbLolRouteStore({ tracks, lookup, onRouteUpdate }) {
  const enrichment = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });

  return {
    update(record) {
      const mapped = tracks.update(record);
      if (mapped) enrichment.enrich(mapped, tracks);
    },
    setEnabled: enrichment.setEnabled,
  };
}
export default createAdsbLolRouteStore;
