import { metarFlightCategory } from "./fields/category.mjs";
import { cloudText } from "./fields/clouds.mjs";
import { conditionText } from "./fields/conditions.mjs";
import { fahrenheitText } from "./fields/temperature.mjs";
import { timeText } from "./fields/time.mjs";
import { visibilityText } from "./fields/visibility.mjs";
import { windDirectionText } from "./fields/wind.mjs";
import { windSpeedText } from "./fields/wind-speed.mjs";

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
