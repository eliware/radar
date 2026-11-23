import { default as createAdsbLolRouteStore } from "./route/store.mjs";
import { default as createAdsbLolTrackStore } from "./track-store.mjs";

function createAdsbLolAircraftStore({
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
export default createAdsbLolAircraftStore;
