import { default as renderHome } from "./client.mjs";
import { default as createRadarView } from "./create/radar/view.mjs";
import { default as startDashboard } from "./dashboard.mjs";

renderHome(document);
startDashboard({
  document,
  fetchData: window.fetch.bind(window),
  WebSocketClass: window.WebSocket,
  createScene: createRadarView,
});
