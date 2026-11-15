import { cleanupDashboardSetup } from "./cleanup.mjs";

export async function runDashboardStartup(resources, start) {
  try {
    return await start();
  } catch {
    cleanupDashboardSetup(resources);
    return null;
  }
}
