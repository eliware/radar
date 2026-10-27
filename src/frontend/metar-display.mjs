import { formatMetarAge, getMetarAgeMinutes } from "../shared/metar/age.mjs";
import { metarCategoryLabel } from "../shared/metar/fields.mjs";

export function updateMetarDisplay(element, ticker, data, now = new Date()) {
  if (!element || !ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (!reports.length) {
    element.textContent = "No METAR reports available.";
    ticker.textContent = "No METAR reports available.";
    return;
  }
  element.innerHTML = `<table><thead><tr>${headers()}</tr></thead><tbody>${reports
    .map((report) => reportRow(report, now))
    .join("")}</tbody></table>`;
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
  restartTickerAnimation(ticker.firstElementChild);
}

function restartTickerAnimation(line) {
  if (!line) return;
  line.style.animation = "none";
  void line.offsetWidth;
  line.style.animation = "";
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
    return `<tr><td></td><th>${escapeText(id)}</th><td>—</td><td colspan="9">${escapeText(metar)}</td></tr>`;
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
        const oldClass = getMetarAgeMinutes(decoded.observed, now) > 60 ? " metar-age-old" : "";
        return `<td class="metar-age${oldClass}">${escapeText(value)}</td>`;
      }
      if (index === 6) return `<td class="metar-visibility">${escapeText(value)}</td>`;
      if (index === 8) return `<td class="metar-sky">${escapeText(value)}</td>`;
      return `<td${index === 7 ? ' class="metar-weather"' : ""}>${escapeText(value)}</td>`;
    })
    .join("")}</tr>`;
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeText(id)} ${metarCategoryLabel(decoded?.flightCategory)} ${escapeText(metar)}`.trim();
}

function escapeText(value) {
  return String(value ?? "—").replace(
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
