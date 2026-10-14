import { attachDashboardCompassControls } from "./attach-dashboard-compass-controls.mjs";
import { connectWebSocketFeed } from "./websocket-feed.mjs";
import { createRadarReferenceLoader } from "./radar-reference-loader.mjs";
import { createFlightStripView } from "./flight-strips.mjs";
import { startMetarRefresh } from "./start-metar-refresh.mjs";
import { handleDashboardFeedUpdate } from "./handle-dashboard-feed-update.mjs";
import { dashboardWebSocketUrl } from "./dashboard-websocket-url.mjs";
import { attachDashboardPagehide } from "./attach-dashboard-pagehide.mjs";
import { destroyDashboardResources } from "./destroy-dashboard-resources.mjs";
import { attachFlightStripsToggle } from "./attach-flight-strips-toggle.mjs";

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
  const detachFlightStripsToggle = attachFlightStripsToggle(
    document,
    document.querySelector(".dashboard"),
    stripPanel,
  );
  const resources = { windowRef, flightStrips, detachFlightStripsToggle };
  try {
    const config = await readJson(fetchData, "/api/config");
    resources.metarTimer = startMetarRefresh({
      fetchData,
      panel: document.querySelector("[data-metar-reports]"),
      ticker: document.querySelector("[data-metar-ticker]"),
      timerHost: windowRef,
    });
    const home = document.querySelector("[data-home]");
    home.textContent = config.location
      ? `${config.location.latitude.toFixed(4)}°, ${config.location.longitude.toFixed(4)}° · ${config.elevationFeet} ft MSL`
      : `Set MY_LOCATION in .env · ${config.elevationFeet} ft MSL`;
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
          // Keep the WebSocket active. The next connection will request a fresh snapshot.
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
