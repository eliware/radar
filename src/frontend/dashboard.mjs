import { default as attachDashboardCompassControls } from "./attach/dashboard/compass-controls.mjs";
import { default as loadDashboardReferences } from "./dashboard/references.mjs";
import { default as connectDashboardFeed } from "./dashboard/feed.mjs";
import { default as attachDashboardLifecycle } from "./attach/dashboard/lifecycle.mjs";
import { default as runDashboardStartup } from "./dashboard/startup.mjs";
import { default as createDashboardViewport } from "./dashboard/viewport.mjs";
import { default as readJson } from "./read-json.mjs";
import { default as createDashboardDisplaySetup } from "./dashboard/display-setup.mjs";
async function startDashboard({
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
  return runDashboardStartup(resources, async () => {
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
    const viewport = createDashboardViewport(scene, document);
    resources.detachViewportReporter = viewport.destroy;
    const feed = connectDashboardFeed({
      WebSocketClass,
      document,
      scene,
      flightStrips,
      sendViewport: viewport.send,
    });
    resources.feed = feed;
    resources.detachViewport = viewport.observe(() => feed.socket);
    const destroy = attachDashboardLifecycle(windowRef, resources);
    return { scene, socket: feed.socket, feed, flightStrips, destroy };
  });
}
export default startDashboard;
