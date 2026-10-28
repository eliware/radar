import { createRadarReferenceCacheSession } from "./cache-session.mjs";
import { fetchRadarReferenceLayers } from "./layer-requests.mjs";
import { createRadarReferenceRequestScheduler } from "./request-scheduler.mjs";
import { createRadarReferenceViewLoader } from "./view/loader.mjs";

export function createRadarReferenceLoader(fetchData, scene, location) {
  const session = createRadarReferenceCacheSession(scene, location);
  const scheduler = createRadarReferenceRequestScheduler(
    (minimum, maximum) => fetchRadarReferenceLayers(fetchData, minimum, maximum),
    (collections) => session.add(collections),
  );

  return createRadarReferenceViewLoader(session, scheduler);
}
