import { buildFlightStripData } from "./flight/strip/data.mjs";
import { getAircraftAgeBrightness } from "./aircraft/age-brightness.mjs";

const MIN_FLIGHT_STRIP_OPACITY = 0.25;

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
      if (!value && !labels[index]) return '<span aria-hidden="true"></span>';
      const title = ` title="${escapeHtml(`${labels[index]}: ${value}`)}"`;
      return `<span${title}>${escapeHtml(value)}</span>`;
    })
    .join("");
  return `<div class="flight-strip-row" style="grid-template-columns:${columns}">${cells}</div>`;
}

export function renderFlightStrips(container, aircraft, width, now = Date.now()) {
  if (!container) return;
  const scrollTop = container.querySelector?.(".flight-strip-list")?.scrollTop ?? 0;
  const data = buildFlightStripData(aircraft, width);
  const rows = data.aircraft
    .map((item) => {
      const body = item.groups
        .map((row, index) => rowMarkup(row, data.weights[index], item.labels[index]))
        .join("");
      const opacity = Math.max(
        MIN_FLIGHT_STRIP_OPACITY,
        getAircraftAgeBrightness(item.lastSeen, now),
      );
      const classes = [
        item.remoteOnly && "remote-only",
        item.emergency && "emergency",
        item.nearHomePass && !item.remoteOnly && !item.emergency && "near-home-pass",
        item.nearHomePass &&
          !item.remoteOnly &&
          !item.emergency &&
          (Math.floor(now / 500) % 2 ? "flash-white" : "flash-green"),
      ].filter(Boolean);
      const classNames = classes.length ? ` ${classes.join(" ")}` : "";
      return `<div class="flight-strip-aircraft${classNames}" data-icao="${escapeHtml(item.icao)}" style="opacity:${opacity}">${body}</div>`;
    })
    .join("");
  container.innerHTML = `<div class="flight-strip-frame"><div class="flight-strip-title"><span>FLIGHT STRIPS</span><span>${data.count} AIRCRAFT</span></div><div class="flight-strip-list rows-${data.rowCount}">${rows || '<p class="flight-strip-empty">Waiting for aircraft...</p>'}</div></div>`;
  const nextList = container.querySelector?.(".flight-strip-list");
  if (nextList) nextList.scrollTop = scrollTop;
}
