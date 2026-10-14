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
  ticker.textContent = reports.map(({ id, metar }) => `${id} ${metar}`).join("　•　");
}

function headers() {
  return [
    "<th></th>",
    "<th>APT</th>",
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
    return `<tr><td></td><th>${escapeText(id)}</th><td colspan="9">${escapeText(metar)}</td></tr>`;
  const values = [
    decoded.automated ? "A" : "",
    id,
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
    .map(
      (value, index) =>
        `<td${index === 6 ? ' class="metar-weather"' : ""}>${escapeText(value)}</td>`,
    )
    .join("")}</tr>`;
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
