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

function rowMarkup(values, weights, labels) {
  const columns = weights.map((weight) => `minmax(0, ${weight}fr)`).join(" ");
  const cells = values
    .map((value, index) => {
      if (!value && !labels[index]) return "";
      const title = ` title="${escapeHtml(`${labels[index]}: ${value}`)}"`;
      return `<span${title}>${escapeHtml(value)}</span>`;
    })
    .join("");
  return `<div class="flight-strip-row" style="grid-template-columns:${columns}">${cells}</div>`;
}

export function renderFlightStrips(container, aircraft, width) {
  if (!container) return;
  const data = buildFlightStripData(aircraft, width);
  const rows = data.aircraft
    .map((item) => {
      const body = item.groups
        .map((row, index) => rowMarkup(row, data.weights[index], item.labels[index]))
        .join("");
      return `<div class="flight-strip-aircraft" data-icao="${escapeHtml(item.icao)}">${body}</div>`;
    })
    .join("");
  container.innerHTML = `<div class="flight-strip-frame"><div class="flight-strip-title"><span>FLIGHT STRIPS</span><span>${data.count} AIRCRAFT</span></div><div class="flight-strip-list">${rows || '<p class="flight-strip-empty">Waiting for aircraft...</p>'}</div></div>`;
}

export function createFlightStripView(container, windowRef, clock = Date.now) {
  const aircraft = new Map();
  const render = () => {
    const now = clock();
    for (const [icao, item] of aircraft) {
      if (Number.isFinite(item.lastSeen) && now - item.lastSeen > 120000) aircraft.delete(icao);
    }
    renderFlightStrips(container, [...aircraft.values()], availableWidth(container, windowRef));
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

function availableWidth(container, windowRef) {
  const width = container?.clientWidth ?? 0;
  const style = windowRef?.getComputedStyle?.(container);
  if (!style) return width;
  const padding =
    Number.parseFloat(style.paddingLeft || 0) + Number.parseFloat(style.paddingRight || 0);
  return Math.max(0, width - padding - 6);
}
