import { default as metarFlightCategory } from "./fields/category.mjs";
import { default as cloudText } from "./fields/clouds.mjs";
import { default as conditionText } from "./fields/conditions.mjs";
import { default as fahrenheitText } from "./fields/temperature.mjs";
import { default as timeText } from "./fields/time.mjs";
import { default as visibilityText } from "./fields/visibility.mjs";
import { default as windDirectionText } from "./fields/wind.mjs";
import { default as windSpeedText } from "./fields/wind-speed.mjs";

function decodedFields(data) {
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
export default decodedFields;
