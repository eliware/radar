import { formatMetarAge } from "../../shared/metar/age-format.mjs";
import { metarCategoryLabel } from "../../shared/metar/category.mjs";
import { metarAgeStatusClass } from "./age-status.mjs";
import { escapeMetarHtml } from "./escape.mjs";

export function renderMetarTable(reports, now = new Date()) {
  return `<table><thead><tr>${headers()}</tr></thead><tbody>${reports
    .map((report) => reportRow(report, now))
    .join("")}</tbody></table>`;
}

function headers() {
  return [
    "<th></th>",
    "<th>APT</th>",
    "<th>FLT</th>",
    '<th class="metar-age-header">AGE</th>',
    '<th class="metar-wind-header" colspan="2">WIND</th>',
    '<th class="metar-vis-header">VIS</th>',
    '<th class="metar-wx-header">WX</th>',
    '<th class="metar-sky-header">SKY</th>',
    "<th>TMP</th>",
    "<th>DEW</th>",
    "<th>ALT</th>",
  ].join("");
}

function reportRow({ id, metar, decoded }, now) {
  if (!decoded)
    return `<tr><td></td><th>${escapeMetarHtml(id)}</th><td>—</td><td colspan="9">${escapeMetarHtml(metar)}</td></tr>`;
  const values = [
    decoded.automated ? "A" : "",
    id,
    decoded.flightCategory,
    formatMetarAge(decoded.observed, now),
    decoded.windDirection,
    decoded.windSpeed,
    decoded.visibility,
    decoded.conditions,
    decoded.clouds,
    decoded.temperature,
    decoded.dewPoint,
    decoded.altimeter,
  ];
  return `<tr>${values
    .map((value, index) => {
      if (index === 2) return `<td>${metarCategoryLabel(value)}</td>`;
      if (index === 3) {
        const oldClass = metarAgeStatusClass(decoded.observed, now);
        return `<td class="metar-age${oldClass}">${escapeMetarHtml(value)}</td>`;
      }
      if (index === 6) return `<td class="metar-visibility">${escapeMetarHtml(value)}</td>`;
      if (index === 8) return `<td class="metar-sky">${escapeMetarHtml(value)}</td>`;
      return `<td${index === 7 ? ' class="metar-weather"' : ""}>${escapeMetarHtml(value)}</td>`;
    })
    .join("")}</tr>`;
}
