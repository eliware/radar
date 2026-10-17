import { attachDashboardCompassControls } from "./attach/dashboard/compass-controls.mjs";
import { connectWebSocketFeed } from "./websocket-feed.mjs";
import { createRadarReferenceLoader } from "./radar/reference/loader.mjs";
import { createFlightStripView } from "./flight/strips.mjs";
import { startMetarRefresh } from "./start/metar-refresh.mjs";
import { handleDashboardFeedUpdate } from "./handle-dashboard-feed-update.mjs";
import { dashboardWebSocketUrl } from "./dashboard-websocket-url.mjs";
import { attachDashboardPagehide } from "./attach/dashboard/pagehide.mjs";
import { destroyDashboardResources } from "./destroy/dashboard-resources.mjs";
import { attachDashboardDisplayToggles } from "./attach/dashboard/display-toggles.mjs";

export async function startDashboard({
  document,
  fetchData,
  WebSocketClass,
  createScene,
  windowRef = globalThis.window,
}) {
  const container = document.querySelector("[data-scene]");
  if (!container) return null;
  const stripPanel = document.querySelector("[data-flight-strips]");
  const flightStrips = createFlightStripView(stripPanel, windowRef);
  const resources = {
    windowRef,
    flightStrips,
  };
  const displayToggles = attachDashboardDisplayToggles(document, fetchData, (enabled) =>
    resources.metarRefresh?.setEnabled(enabled),
  );
  Object.assign(resources, displayToggles);
  try {
    const config = await readJson(fetchData, "/api/config");
    flightStrips.setHome(config.location, config.elevationFeet);
    resources.metarRefresh = startMetarRefresh({
      fetchData,
      panel: document.querySelector("[data-metar-reports]"),
      ticker: document.querySelector("[data-metar-ticker]"),
      timerHost: windowRef,
      enabled: !displayToggles.panel?.hidden,
    });
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
    let detachReferences = () => {};
    const referenceLoader =
      scene.updateAirports &&
      scene.updateNavaids &&
      scene.updateBoundaries &&
      scene.updateIls &&
      scene.updateProcedures &&
      scene.updateAirways &&
      scene.range
        ? createRadarReferenceLoader(fetchData, scene)
        : null;
    if (referenceLoader)
      detachReferences =
        scene.onViewChange((range) => referenceLoader.load(range ?? scene.range())) ?? (() => {});
    resources.detachReferences = detachReferences;
    if (referenceLoader) referenceLoader.load(scene.range());
    const aircraft = await readJson(fetchData, "/api/aircraft");
    flightStrips.update(aircraft);
    aircraft.forEach((item) => scene.update(item));
    const feed = connectWebSocketFeed({
      WebSocketClass,
      url: dashboardWebSocketUrl(document.location),
      onState: (connected) => scene.setConnected?.(connected),
      onMessage: (data) => handleDashboardFeedUpdate(scene, flightStrips, data),
      onOpen: async () => {
        try {
          const latest = await readJson(fetchData, "/api/aircraft");
          flightStrips.update(latest);
          latest.forEach((item) => scene.update(item));
        } catch {
          // Keep WebSocket open.
          // Reconnection requests the current snapshot.
        }
      },
    });
    resources.feed = feed;
    const destroy = attachDashboardPagehide(windowRef, () => destroyDashboardResources(resources));
    return { scene, socket: feed.socket, feed, flightStrips, destroy };
  } catch {
    destroyDashboardResources(resources);
    return null;
  }
}

async function readJson(fetchData, path) {
  const response = await fetchData(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}
