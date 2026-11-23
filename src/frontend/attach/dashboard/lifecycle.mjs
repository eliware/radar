import { default as attachDashboardPagehide } from "./pagehide.mjs";
import { default as cleanupDashboardSetup } from "../../dashboard/cleanup.mjs";

function attachDashboardLifecycle(windowRef, resources) {
  return attachDashboardPagehide(windowRef, () => cleanupDashboardSetup(resources));
}
export default attachDashboardLifecycle;
