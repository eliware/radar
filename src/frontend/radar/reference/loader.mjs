import { default as createRadarReferenceCacheSession } from "./cache-session.mjs";
import { default as fetchRadarReferenceLayers } from "./layer-requests.mjs";
import { default as createRadarReferenceRequestScheduler } from "./request-scheduler.mjs";
import { default as createRadarReferenceViewLoader } from "./view/loader.mjs";

function createRadarReferenceLoader(fetchData, scene, location) {
  const session = createRadarReferenceCacheSession(scene, location);
  const scheduler = createRadarReferenceRequestScheduler(
    (minimum, maximum) => fetchRadarReferenceLayers(fetchData, minimum, maximum),
    (collections) => session.add(collections),
  );

  return createRadarReferenceViewLoader(session, scheduler);
}
export default createRadarReferenceLoader;
