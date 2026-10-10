import { renderHome } from "./client.mjs";
import { createAircraftScene } from "./aircraft-scene.mjs";
import { startDashboard } from "./dashboard.mjs";

renderHome(document);
startDashboard({
  document,
  fetchData: window.fetch.bind(window),
  WebSocketClass: window.WebSocket,
  createScene: createAircraftScene,
});
