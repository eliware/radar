import { SBS_FIELD_NAMES, SBS_NUMERIC_FIELDS } from "./schema.mjs";

export function parseSbsFields(values) {
  return Object.fromEntries(
    SBS_FIELD_NAMES.map((name, index) => [name, fieldValue(values[index], name)]),
  );
}

function fieldValue(value, name) {
  const cleanValue = value?.trim() ?? "";
  if (!cleanValue) return null;
  if (name === "icao") return cleanValue.toUpperCase();
  if (!SBS_NUMERIC_FIELDS.has(name)) return cleanValue;
  const number = Number(cleanValue);
  return Number.isFinite(number) ? number : cleanValue;
}
