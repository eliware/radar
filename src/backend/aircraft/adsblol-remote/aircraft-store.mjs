import { createAdsbLolRouteStore } from "./route/store.mjs";
import { createAdsbLolTrackStore } from "./track-store.mjs";

export function createAdsbLolAircraftStore({
  location,
  lookup,
  clock = Date.now,
  onRouteUpdate = () => {},
}) {
  const tracks = createAdsbLolTrackStore({ location, clock });
  const routes = createAdsbLolRouteStore({ tracks, lookup, onRouteUpdate });

  return {
    list: tracks.list,
    update: routes.update,
    clear: tracks.clear,
    setRouteLookupsEnabled: routes.setEnabled,
  };
}
