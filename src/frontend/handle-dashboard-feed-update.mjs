export function handleDashboardFeedUpdate(scene, flightStrips, data) {
  let aircraft;
  try {
    aircraft = JSON.parse(data);
  } catch {
    return;
  }
  if (aircraft?.event === "aircraft-snapshot") {
    scene.updateSnapshot?.(aircraft.aircraft, aircraft.localFurthestDistanceNm);
    flightStrips.updateSnapshot?.(aircraft.aircraft);
    return;
  }
}
