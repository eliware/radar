import { metarCategoryLabel } from "../category-label.mjs";
import { formatMetarAgeDisplay } from "../age/display.mjs";
import { escapeHtml } from "../../html/escape.mjs";

export function renderMetarTableRow({ id, metar, decoded }, now) {
  if (!decoded)
    return `<tr><td></td><th>${escapeHtml(id)}</th><td>—</td><td colspan="9">${escapeHtml(metar)}</td></tr>`;
  const age = formatMetarAgeDisplay(decoded.observed, now);
  const values = [
    decoded.automated ? "A" : "",
    id,
    decoded.flightCategory,
    age.text,
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
      if (index === 3) return `<td class="metar-age${age.statusClass}">${escapeHtml(value)}</td>`;
      if (index === 6) return `<td class="metar-visibility">${escapeHtml(value)}</td>`;
      if (index === 8) return `<td class="metar-sky">${escapeHtml(value)}</td>`;
      return `<td${index === 7 ? ' class="metar-weather"' : ""}>${escapeHtml(value)}</td>`;
    })
    .join("")}</tr>`;
}
