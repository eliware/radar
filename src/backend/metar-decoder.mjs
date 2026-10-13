import { parseMetar } from "metar-taf-parser";

export function decodeMetarReport(report, parse = parseMetar) {
  try {
    const { id, metar } = report;
    const source = String(metar ?? "").trim();
    const message = /^(METAR|SPECI)\s/i.test(source) ? source : ["METAR", id, source].join(" ");
    const data = parse(message);
    const decoded = decodedFields(data);
    return {
      ...report,
      decoded: Object.values(decoded).every((value) => value === "—") ? null : decoded,
    };
  } catch {
    return { ...report, decoded: null };
  }
}

function decodedFields(data) {
  return {
    observed: timeText(data),
    wind: windText(data.wind),
    visibility: visibilityText(data),
    conditions: conditionText(data.weatherConditions),
    clouds: cloudText(data),
    temperature: temperatureText(data),
    altimeter: data.altimeter ? `${data.altimeter.value} ${data.altimeter.unit}` : "—",
  };
}

function timeText({ day, hour, minute }) {
  if (day == null || hour == null || minute == null) return "—";
  return `${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}Z`;
}

function windText(wind) {
  if (!wind) return "—";
  const direction = wind.degrees == null ? wind.direction : `${wind.degrees}°`;
  const gust = wind.gust == null ? "" : `G${wind.gust}`;
  return `${direction} ${wind.speed}${gust} ${wind.unit}`;
}

function visibilityText(data) {
  if (data.verticalVisibility != null) return `VV ${data.verticalVisibility} ft`;
  if (!data.visibility) return "—";
  return `${data.visibility.indicator ?? ""}${data.visibility.value} ${data.visibility.unit}`;
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
  if (data.clouds.length) {
    return data.clouds
      .map(({ quantity, height, type }) => `${quantity} ${height ?? "—"}${type ?? ""}`)
      .join(" ");
  }
  return data.cavok ? "CAVOK" : "—";
}

function temperatureText(data) {
  if (data.temperature == null && data.dewPoint == null) return "—";
  return `${data.temperature ?? "—"}/${data.dewPoint ?? "—"} °C`;
}
