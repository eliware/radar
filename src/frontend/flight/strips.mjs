import { createFlightStripAircraftStore } from "./aircraft-store.mjs";
import { renderFlightStrips } from "../render-flight-strips.mjs";
import { scheduleFlightStripRefresh } from "./strip/scheduling.mjs";

export function createFlightStripView(container, windowRef, clock = Date.now) {
  const aircraft = createFlightStripAircraftStore(clock);
  let location = null;
  let elevationFeet = 0;
  const render = () => {
    const now = clock();
    renderFlightStrips(
      container,
      aircraft.list(location, elevationFeet, now),
      availableWidth(container, windowRef),
      now,
    );
  };
  const stopScheduling = scheduleFlightStripRefresh(windowRef, render);
  render();
  return {
    setHome(homeLocation, homeElevationFeet) {
      location = homeLocation;
      elevationFeet = homeElevationFeet;
      render();
    },
    update(items) {
      aircraft.update(items);
      render();
    },
    updateRemote(items) {
      aircraft.updateRemote(items);
      render();
    },
    updateSnapshot(items) {
      aircraft.replace(items);
      render();
    },
    destroy() {
      stopScheduling();
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
