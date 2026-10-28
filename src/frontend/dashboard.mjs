import { attachDashboardCompassControls } from "./attach/dashboard/compass-controls.mjs";
import { loadDashboardReferences } from "./dashboard/references.mjs";
import { connectDashboardFeed } from "./dashboard/feed.mjs";
import { attachDashboardLifecycle } from "./attach/dashboard/lifecycle.mjs";
import { cleanupDashboardSetup } from "./dashboard/cleanup.mjs";
import { createViewportReporter } from "./report-viewport.mjs";
import { readJson } from "./read-json.mjs";
import { createDashboardDisplaySetup } from "./dashboard/display-setup.mjs";
export async function startDashboard({
  document,
  fetchData,
  WebSocketClass,
  createScene,
  windowRef = globalThis.window,
}) {
  const container = document.querySelector("[data-scene]");
  if (!container) return null;
  const resources = { windowRef };
  const display = createDashboardDisplaySetup({
    document,
    fetchData,
    windowRef,
    onMetarEnabled: (enabled) => resources.metarRefresh?.setEnabled(enabled),
  });
  resources.flightStrips = display.flightStrips;
  Object.assign(resources, display.toggles);
  const { flightStrips } = display;
  try {
    const config = await readJson(fetchData, "/api/config");
    flightStrips.setHome(config.location, config.elevationFeet);
    resources.metarRefresh = display.startMetarRefresh();
    const scene = await createScene({
      container,
      location: config.location,
      elevationFeet: config.elevationFeet,
      defaultRangeNm: config.defaultRangeNm,
      defaultRotationDegrees: config.defaultRotationDegrees,
      onMode: (mode) =>
        document.querySelector("[data-metar]").setAttribute("data-radar-mode", mode),
    });
    resources.scene = scene;
    Object.assign(resources, attachDashboardCompassControls(document, windowRef, scene));
    resources.detachReferences = loadDashboardReferences(fetchData, scene, config.location);
    const sendViewport = createViewportReporter(scene, document);
    resources.detachViewportReporter = sendViewport.destroy;
    const feed = connectDashboardFeed({
      WebSocketClass,
      document,
      scene,
      flightStrips,
      sendViewport,
    });
    resources.feed = feed;
    resources.detachViewport = scene.onViewChange?.(() => sendViewport(feed.socket));
    const destroy = attachDashboardLifecycle(windowRef, resources);
    return { scene, socket: feed.socket, feed, flightStrips, destroy };
  } catch {
    cleanupDashboardSetup(resources);
    return null;
  }
}
