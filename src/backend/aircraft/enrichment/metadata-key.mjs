export function normalizeAircraftMetadataKey(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}
