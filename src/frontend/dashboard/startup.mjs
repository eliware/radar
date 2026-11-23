import { default as cleanupDashboardSetup } from "./cleanup.mjs";

async function runDashboardStartup(resources, start) {
  try {
    return await start();
  } catch {
    cleanupDashboardSetup(resources);
    return null;
  }
}
export default runDashboardStartup;
