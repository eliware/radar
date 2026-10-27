import { metarFlightCategory } from "./flight-category.mjs";

export function decodedFields(data) {
  return {
    automated: Boolean(data.auto),
    observed: timeText(data),
    windDirection: windDirectionText(data.wind),
    windSpeed: windSpeedText(data.wind),
    visibility: visibilityText(data),
    flightCategory: metarFlightCategory(data),
    conditions: conditionText(data.weatherConditions),
    clouds: cloudText(data),
    temperature: fahrenheitText(data.temperature),
    dewPoint: fahrenheitText(data.dewPoint),
    altimeter: data.altimeter ? Number(data.altimeter.value).toFixed(2) : "—",
  };
}

function timeText({ day, hour, minute }) {
  if (day == null || hour == null || minute == null) return "—";
  return `${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}Z`;
}
function windDirectionText(wind) {
  if (!wind) return "—";
  return wind.degrees == null ? wind.direction : `${String(wind.degrees).padStart(3, "0")}°`;
}
function windSpeedText(wind) {
  if (!wind) return "—";
  return `${wind.speed}${wind.gust == null ? "" : `G${wind.gust}`}`;
}
function visibilityText(data) {
  if (data.verticalVisibility != null) return `VV ${data.verticalVisibility} ft`;
  if (!data.visibility) return "—";
  return `${data.visibility.indicator ?? ""}${data.visibility.value}`;
}
function conditionText(conditions) {
  return conditions.length
    ? conditions
        .map(
          ({ intensity = "", descriptive = "", phenomenons }) =>
            `${intensity}${descriptive}${phenomenons.join("")}`,
        )
        .join(" ")
    : "—";
}
function cloudText(data) {
  if (data.verticalVisibility != null) return "Vertical visibility";
  if (data.clouds.length) return data.clouds.map(cloudLayerText).join(" ");
  return data.cavok ? "CAVOK" : "—";
}
function cloudLayerText({ quantity, height, type }) {
  const altitude = height == null ? "—" : String(Math.round(height / 100)).padStart(3, "0");
  return `${quantity}${altitude}${type ?? ""}`;
}
function fahrenheitText(celsius) {
  return celsius == null ? "—" : `${Math.round((celsius * 9) / 5 + 32)}°F`;
}
