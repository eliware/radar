import { isAircraftProjectedNearHome } from "../aircraft/near-home-pass.mjs";
import { renderFlightStrips } from "../render-flight-strips.mjs";

export function createFlightStripView(container, windowRef, clock = Date.now) {
  const aircraft = new Map();
  let location = null;
  let elevationFeet = 0;
  const render = () => {
    const now = clock();
    for (const [icao, item] of aircraft) {
      if (Number.isFinite(item.lastSeen) && now - item.lastSeen > 120000) aircraft.delete(icao);
    }
    renderFlightStrips(
      container,
      [...aircraft.values()].map((item) => ({
        ...item,
        nearHomePass: isAircraftProjectedNearHome(item, location, elevationFeet),
      })),
      availableWidth(container, windowRef),
      now,
    );
  };
  windowRef?.addEventListener?.("resize", render);
  const timer = windowRef?.setInterval?.(render, 500);
  render();
  return {
    setHome(homeLocation, homeElevationFeet) {
      location = homeLocation;
      elevationFeet = homeElevationFeet;
      render();
    },
    update(items) {
      for (const item of Array.isArray(items) ? items : [items]) {
        if (item?.icao) aircraft.set(item.icao, item);
      }
      render();
    },
    updateRemote(items) {
      const remoteIds = new Set(items.filter((item) => item.remoteOnly).map((item) => item.icao));
      for (const [icao, item] of aircraft)
        if (item.remoteOnly && !remoteIds.has(icao)) aircraft.delete(icao);
      for (const item of items) aircraft.set(item.icao, item);
      render();
    },
    updateSnapshot(items) {
      aircraft.clear();
      for (const item of Array.isArray(items) ? items : [])
        if (item?.icao) aircraft.set(item.icao, item);
      render();
    },
    destroy() {
      windowRef?.removeEventListener?.("resize", render);
      if (timer !== undefined) windowRef?.clearInterval?.(timer);
    },
  };
}

function availableWidth(container, windowRef) {
  const width = container?.clientWidth ?? 0;
  const style = windowRef?.getComputedStyle?.(container);
  if (!style) return width;
  const padding =
    Number.parseFloat(style.paddingLeft || 0) + Number.parseFloat(style.paddingRight || 0);
  return Math.max(0, width - padding - 6);
}
