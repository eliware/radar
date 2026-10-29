import { selectAircraftRecordSources } from "./source/selection.mjs";

export function mergeAircraftRecord({ local, remote }, now, localFreshnessMs) {
  const { primary, fallback, remoteOnly } = selectAircraftRecordSources(
    local,
    remote,
    now,
    localFreshnessMs,
  );
  if (remoteOnly) return { ...primary, remoteOnly: true };
  const combined = { ...fallback, ...primary };
  for (const [key, value] of Object.entries(fallback ?? {})) {
    if (key === "remoteOnly") continue;
    if (primary[key] === null || primary[key] === undefined || primary[key] === "")
      combined[key] = value;
  }
  combined.remoteOnly = false;
  return combined;
}
