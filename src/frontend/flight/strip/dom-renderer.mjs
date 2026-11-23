import { default as buildFlightStripData } from "./data.mjs";
import { default as renderFlightStripMarkup } from "./renderer.mjs";

function renderFlightStrips(container, aircraft, width, now = Date.now()) {
  if (!container) return;
  const scrollTop = container.querySelector?.(".flight-strip-list")?.scrollTop ?? 0;
  const data = buildFlightStripData(aircraft, width);
  container.innerHTML = renderFlightStripMarkup(data, now);
  const nextList = container.querySelector?.(".flight-strip-list");
  if (nextList) nextList.scrollTop = scrollTop;
}
export default renderFlightStrips;
