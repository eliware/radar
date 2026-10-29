import { createAircraftSceneDashboardBindings } from "./dashboard-bindings.mjs";
import { createAircraftSceneResources } from "./resources.mjs";

export function createAircraftSceneSetup(options) {
  const resources = createAircraftSceneResources(options);
  const dashboard = createAircraftSceneDashboardBindings(resources.dashboardOptions);
  return {
    connection: resources.connection,
    workflow: dashboard.workflow,
    layers: resources.layers,
    references: dashboard.references,
    updateAirspace: (items) => resources.airspace.update(items),
    viewport: dashboard.viewport,
    orbit: resources.orbit,
    radar: { reset: resources.radar.reset },
    destroy: () => resources.destroy(dashboard.workflow),
  };
}
