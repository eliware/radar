import { attachDashboardPagehide } from "./pagehide.mjs";
import { cleanupDashboardSetup } from "../../dashboard/cleanup.mjs";

export function attachDashboardLifecycle(windowRef, resources) {
  return attachDashboardPagehide(windowRef, () => cleanupDashboardSetup(resources));
}
