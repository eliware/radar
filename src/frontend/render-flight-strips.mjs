import { buildFlightStripData } from "./flight/strip/data.mjs";
import { renderFlightStripMarkup } from "./flight/strip/renderer.mjs";

export function renderFlightStrips(container, aircraft, width, now = Date.now()) {
  if (!container) return;
  const scrollTop = container.querySelector?.(".flight-strip-list")?.scrollTop ?? 0;
  const data = buildFlightStripData(aircraft, width);
  container.innerHTML = renderFlightStripMarkup(data, now);
  const nextList = container.querySelector?.(".flight-strip-list");
  if (nextList) nextList.scrollTop = scrollTop;
}
