import { renderHome } from "./client.mjs";
import { createRadarView } from "./create-radar-view.mjs";
import { startDashboard } from "./dashboard.mjs";

renderHome(document);
startDashboard({
  document,
  fetchData: window.fetch.bind(window),
  WebSocketClass: window.WebSocket,
  createScene: createRadarView,
});
