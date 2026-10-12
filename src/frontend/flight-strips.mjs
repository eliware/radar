import { buildFlightStripData } from "./flight-strip-data.mjs";

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function rowMarkup(values, weights, heading = false, lastHeading = false) {
  const columns = weights.map((weight) => `minmax(0, ${weight}fr)`).join(" ");
  const cells = values.map((value) => `<span>${escapeHtml(value)}</span>`).join("");
  const classes = `${heading ? " flight-strip-heading" : ""}${lastHeading ? " flight-strip-header-end" : ""}`;
  return `<div class="flight-strip-row${classes}" style="grid-template-columns:${columns}">${cells}</div>`;
}

export function renderFlightStrips(container, aircraft, width, now = Date.now()) {
  if (!container) return;
  const data = buildFlightStripData(aircraft, width, now);
  const headings = data.headers
    .map((row, index) =>
      rowMarkup(row, data.weights[index], true, index === data.headers.length - 1),
    )
    .join("");
  const rows = data.aircraft
    .map((item) => {
      const body = item.groups.map((row, index) => rowMarkup(row, data.weights[index])).join("");
      return `<div class="flight-strip-aircraft" data-icao="${escapeHtml(item.icao)}">${body}</div>`;
    })
    .join("");
  container.innerHTML = `<div class="flight-strip-frame"><div class="flight-strip-title"><span>RADAR FLIGHT STRIPS</span><span>${data.count} AIRCRAFT</span></div>${headings}<div class="flight-strip-list">${rows || '<p class="flight-strip-empty">Waiting for aircraft...</p>'}</div></div>`;
}

export function createFlightStripView(container, windowRef, clock = Date.now) {
  const aircraft = new Map();
  const render = () => {
    const now = clock();
    for (const [icao, item] of aircraft) {
      if (Number.isFinite(item.lastSeen) && now - item.lastSeen > 120000) aircraft.delete(icao);
    }
    renderFlightStrips(container, [...aircraft.values()], container?.clientWidth ?? 0, now);
  };
  windowRef?.addEventListener?.("resize", render);
  const timer = windowRef?.setInterval?.(render, 1000);
  render();
  return {
    update(items) {
      for (const item of Array.isArray(items) ? items : [items]) {
        if (item?.icao) aircraft.set(item.icao, item);
      }
      render();
    },
    destroy() {
      windowRef?.removeEventListener?.("resize", render);
      if (timer !== undefined) windowRef?.clearInterval?.(timer);
    },
  };
}
