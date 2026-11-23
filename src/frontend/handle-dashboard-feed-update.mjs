import { default as parseDashboardFeedMessage } from "./dashboard/feed-message.mjs";

function handleDashboardFeedUpdate(scene, flightStrips, data) {
  const snapshot = parseDashboardFeedMessage(data);
  if (!snapshot) return;
  scene.updateSnapshot?.(snapshot.aircraft, snapshot.localFurthestDistanceNm);
  flightStrips.updateSnapshot?.(snapshot.aircraft);
}
export default handleDashboardFeedUpdate;
