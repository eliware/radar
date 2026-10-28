import { destroyDashboardResources } from "../destroy/dashboard-resources.mjs";

export function cleanupDashboardSetup(resources) {
  destroyDashboardResources(resources);
}
