import { mergeAircraftRecord } from "./merge.mjs";
import { compareAircraftDistance } from "./order.mjs";

const LOCAL_FRESHNESS_MS = 8000;

export function createMergedAircraftList(
  entries,
  clock = Date.now,
  localFreshnessMs = LOCAL_FRESHNESS_MS,
) {
  return {
    list() {
      const now = clock();
      return [...entries.values()]
        .map((entry) => mergeAircraftRecord(entry, now, localFreshnessMs))
        .sort(compareAircraftDistance);
    },
    localFurthestDistanceNm() {
      return Math.max(
        0,
        ...[...entries.values()]
          .map(({ local }) => local?.distanceNauticalMiles)
          .filter(Number.isFinite),
      );
    },
  };
}
