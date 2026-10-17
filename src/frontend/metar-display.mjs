import { formatMetarAge } from "./format-metar-age.mjs";

export function updateMetarDisplay(element, ticker, data) {
  if (!element || !ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (!reports.length) {
    element.textContent = "No METAR reports available.";
    ticker.textContent = "No METAR reports available.";
    return;
  }
  element.innerHTML = `<table><thead><tr>${headers()}</tr></thead><tbody>${reports
    .map(reportRow)
    .join("")}</tbody></table>`;
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
}

function headers() {
  return [
    "<th></th>",
    "<th>APT</th>",
    "<th>FLT</th>",
    '<th class="metar-age-header">AGE</th>',
    '<th class="metar-wind-header" colspan="2">WIND</th>',
    "<th>VIS</th>",
    '<th class="metar-wx-header">WX</th>',
    '<th class="metar-sky-header">SKY</th>',
    "<th>TMP</th>",
    "<th>DEW</th>",
    "<th>ALT</th>",
  ].join("");
}

function reportRow({ id, metar, decoded }) {
  if (!decoded)
    return `<tr><td></td><th>${escapeText(id)}</th><td>—</td><td colspan="9">${escapeText(metar)}</td></tr>`;
  const values = [
    decoded.automated ? "A" : "",
    id,
    decoded.flightCategory,
    formatMetarAge(decoded.observed),
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
      if (index === 2) return `<td>${categoryLabel(value)}</td>`;
      return `<td${index === 7 ? ' class="metar-weather"' : ""}>${escapeText(value)}</td>`;
    })
    .join("")}</tr>`;
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeText(id)} ${categoryLabel(decoded?.flightCategory)} ${escapeText(metar)}`.trim();
}

function categoryLabel(category) {
  if (!["VFR", "MVFR", "IFR", "LIFR"].includes(category)) return "—";
  return `<span class="flight-category flight-category-${category.toLowerCase()}">${category}</span>`;
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
