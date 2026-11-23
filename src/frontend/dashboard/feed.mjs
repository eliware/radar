import { default as connectWebSocketFeed } from "../websocket/connection.mjs";
import { default as dashboardWebSocketUrl } from "../dashboard-websocket-url.mjs";
import { default as handleDashboardFeedUpdate } from "../handle-dashboard-feed-update.mjs";

function connectDashboardFeed({ WebSocketClass, document, scene, flightStrips, sendViewport }) {
  return connectWebSocketFeed({
    WebSocketClass,
    url: dashboardWebSocketUrl(document.location),
    onState: (connected) => scene.setConnected?.(connected),
    onMessage: (data) => handleDashboardFeedUpdate(scene, flightStrips, data),
    onOpen: (socket) => sendViewport(socket, true),
  });
}
export default connectDashboardFeed;
