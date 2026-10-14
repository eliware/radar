export function handleDashboardFeedUpdate(scene, flightStrips, data) {
  let aircraft;
  try {
    aircraft = JSON.parse(data);
  } catch {
    return;
  }
  scene.update(aircraft);
  flightStrips.update(aircraft);
}
