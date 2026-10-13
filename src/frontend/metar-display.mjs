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
  return ["STATION", "AGE", "WIND", "VIS", "WX", "SKY", "TEMP", "DEW", "ALT"]
    .map((label) => `<th>${label}</th>`)
    .join("");
}

function reportRow({ id, metar, decoded }) {
  if (!decoded)
    return `<tr><th>${escapeText(id)}</th><td colspan="8">${escapeText(metar)}</td></tr>`;
  const values = [
    id,
    formatAge(decoded.observed),
    decoded.wind,
    decoded.visibility,
    decoded.conditions,
    decoded.clouds,
    decoded.temperature,
    decoded.dewPoint,
    decoded.altimeter,
  ];
  return `<tr>${values.map((value) => `<td>${escapeText(value)}</td>`).join("")}</tr>`;
}

export function formatAge(observed, now = new Date()) {
  const match = String(observed ?? "").match(/^(\d{1,2}) (\d{2}):(\d{2})Z$/);
  if (!match) return "—";
  const [, day, hour, minute] = match;
  let month = now.getUTCMonth();
  let year = now.getUTCFullYear();
  if (Number(day) > now.getUTCDate()) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  let stamp = Date.UTC(year, month, Number(day), Number(hour), Number(minute));
  if (stamp > now.getTime()) stamp = now.getTime();
  const ageMinutes = Math.max(0, Math.floor((now.getTime() - stamp) / 60000));
  const hours = Math.floor(ageMinutes / 60);
  const minutes = ageMinutes % 60;
  return hours ? `${hours}h${minutes ? `${minutes}m` : ""}` : `${minutes}m`;
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
