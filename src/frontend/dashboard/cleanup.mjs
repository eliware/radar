import { default as destroyDashboardResources } from "../destroy/dashboard-resources.mjs";

function cleanupDashboardSetup(resources) {
  destroyDashboardResources(resources);
}
export default cleanupDashboardSetup;
