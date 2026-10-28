import { metarFlightCategory } from "./fields/category.mjs";
import {
  cloudText,
  conditionText,
  fahrenheitText,
  timeText,
  visibilityText,
  windDirectionText,
  windSpeedText,
} from "./fields/format.mjs";

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
