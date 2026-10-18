export function handleDashboardFeedUpdate(scene, flightStrips, data) {
  let aircraft;
  try {
    aircraft = JSON.parse(data);
  } catch {
    return;
  }
  if (aircraft?.event === "remote-snapshot") {
    scene.updateRemote?.(aircraft.aircraft);
    flightStrips.updateRemote?.(aircraft.aircraft);
    return;
  }
  scene.update(aircraft);
  flightStrips.update(aircraft);
}
