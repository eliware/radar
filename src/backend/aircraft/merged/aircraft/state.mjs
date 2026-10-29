import { createMergedAircraftList } from "./list.mjs";
import { createMergedAircraftSourceState } from "./source/state.mjs";

export function createMergedAircraftState({ clock = Date.now, localFreshnessMs = 8000 } = {}) {
  const entries = new Map();
  const sources = createMergedAircraftSourceState(entries);
  const aircraftList = createMergedAircraftList(entries, clock, localFreshnessMs);
  return {
    setLocal: (item) => sources.set("local", item),
    replaceLocal: (items) => sources.replace("local", items),
    replaceRemote: (items) => sources.replace("remote", items),
    ...aircraftList,
  };
}
