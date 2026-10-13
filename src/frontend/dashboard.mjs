import { attachRadarCompassDisplay } from "./attach-radar-compass-display.mjs";
import { connectWebSocketFeed } from "./websocket-feed.mjs";
import { createRadarReferenceLoader } from "./radar-reference-loader.mjs";
import { createFlightStripView } from "./flight-strips.mjs";

export async function startDashboard({
  document,
  fetchData,
  WebSocketClass,
  createScene,
  windowRef = globalThis.window,
}) {
  const container = document.querySelector("[data-scene]");
  if (!container) return null;
  const flightStrips = createFlightStripView(
    document.querySelector("[data-flight-strips]"),
    windowRef,
  );
  try {
    const config = await readJson(fetchData, "/api/config");
    const home = document.querySelector("[data-home]");
    home.textContent = config.location
      ? `${config.location.latitude.toFixed(4)}°, ${config.location.longitude.toFixed(4)}° · ${config.elevationFeet} ft MSL`
      : `Set MY_LOCATION in .env · ${config.elevationFeet} ft MSL`;
    const scene = await createScene({
      container,
      location: config.location,
      elevationFeet: config.elevationFeet,
    });
    attachRadarCompassDisplay(document, scene);
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
      scene.onViewChange((range) => referenceLoader.load(range ?? scene.range()));
    if (referenceLoader) referenceLoader.load(scene.range());
    const aircraft = await readJson(fetchData, "/api/aircraft");
    flightStrips.update(aircraft);
    aircraft.forEach((item) => scene.update(item));
    const feed = connectWebSocketFeed({
      WebSocketClass,
      url: webSocketUrl(document.location),
      onState: (connected) => scene.setConnected?.(connected),
      onMessage: (data) => updateScene(scene, data, flightStrips),
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
    const reset = document.querySelector("[data-reset]");
    reset?.addEventListener("click", () => scene.reset());
    return { scene, socket: feed.socket, feed, flightStrips };
  } catch {
    flightStrips.destroy();
    return null;
  }
}

async function readJson(fetchData, path) {
  const response = await fetchData(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

function webSocketUrl(location) {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/ws`;
}

function updateScene(scene, data, flightStrips) {
  let aircraft;
  try {
    aircraft = JSON.parse(data);
  } catch {
    return;
  }
  scene.update(aircraft);
  flightStrips.update(aircraft);
}
