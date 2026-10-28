import { parseDashboardFeedMessage } from "./dashboard/feed-message.mjs";

export function handleDashboardFeedUpdate(scene, flightStrips, data) {
  const snapshot = parseDashboardFeedMessage(data);
  if (!snapshot) return;
  scene.updateSnapshot?.(snapshot.aircraft, snapshot.localFurthestDistanceNm);
  flightStrips.updateSnapshot?.(snapshot.aircraft);
}
