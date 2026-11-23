import { default as selectAircraftRecordSources } from "./source/selection.mjs";

function mergeAircraftRecord({ local, remote }, now, localFreshnessMs) {
  const { primary, fallback, remoteOnly } = selectAircraftRecordSources(
    local,
    remote,
    now,
    localFreshnessMs,
  );
  const combined = { ...fallback, ...primary };
  for (const [key, value] of Object.entries(fallback ?? {})) {
    if (key === "remoteOnly") continue;
    if (primary[key] === null || primary[key] === undefined || primary[key] === "")
      combined[key] = value;
  }
  combined.remoteOnly = remoteOnly;
  return combined;
}
export default mergeAircraftRecord;
