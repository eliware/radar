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
  return ["STATION", "UTC", "WIND", "VIS", "WX", "CLOUDS", "TEMP/DEW", "ALT"]
    .map((label) => `<th>${label}</th>`)
    .join("");
}

function reportRow({ id, metar, decoded }) {
  if (!decoded)
    return `<tr><th>${escapeText(id)}</th><td colspan="7">${escapeText(metar)}</td></tr>`;
  const values = [
    id,
    decoded.observed,
    decoded.wind,
    decoded.visibility,
    decoded.conditions,
    decoded.clouds,
    decoded.temperature,
    decoded.altimeter,
  ];
  return `<tr>${values.map((value) => `<td>${escapeText(value)}</td>`).join("")}</tr>`;
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
