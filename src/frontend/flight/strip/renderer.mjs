import { escapeHtml } from "../../html/escape.mjs";
import { getFlightStripStatus } from "./status.mjs";

function rowMarkup(values, weights, labels) {
  const columns = weights.map((weight) => `minmax(0, ${weight}fr)`).join(" ");
  const cells = values
    .map((value, index) => {
      if (!value && !labels[index]) return '<span aria-hidden="true"></span>';
      const title = ` title="${escapeHtml(`${labels[index]}: ${value}`)}"`;
      return `<span${title}>${escapeHtml(String(value))}</span>`;
    })
    .join("");
  return `<div class="flight-strip-row" style="grid-template-columns:${columns}">${cells}</div>`;
}

export function renderFlightStripMarkup(data, now = Date.now()) {
  const rows = data.aircraft
    .map((item) => {
      const body = item.groups
        .map((row, index) => rowMarkup(row, data.weights[index], item.labels[index]))
        .join("");
      const { opacity, classNames: statusClasses } = getFlightStripStatus(item, now);
      const classNames = statusClasses ? ` ${statusClasses}` : "";
      return `<div class="flight-strip-aircraft${classNames}" data-icao="${escapeHtml(item.icao)}" style="opacity:${opacity}">${body}</div>`;
    })
    .join("");
  return `<div class="flight-strip-frame"><div class="flight-strip-title"><span>FLIGHT STRIPS</span><span>${data.count} AIRCRAFT</span></div><div class="flight-strip-list rows-${data.rowCount}">${rows || '<p class="flight-strip-empty">Waiting for aircraft...</p>'}</div></div>`;
}
