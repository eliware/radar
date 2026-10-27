import { connectWebSocketFeed } from "../websocket-feed.mjs";
import { dashboardWebSocketUrl } from "../dashboard-websocket-url.mjs";
import { handleDashboardFeedUpdate } from "../handle-dashboard-feed-update.mjs";

export function connectDashboardFeed({
  WebSocketClass,
  document,
  scene,
  flightStrips,
  sendViewport,
}) {
  return connectWebSocketFeed({
    WebSocketClass,
    url: dashboardWebSocketUrl(document.location),
    onState: (connected) => scene.setConnected?.(connected),
    onMessage: (data) => handleDashboardFeedUpdate(scene, flightStrips, data),
    onOpen: (socket) => sendViewport(socket, true),
  });
}
