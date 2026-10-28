import { hasUsefulCallsign } from "./callsign.mjs";

export function retainUsefulCallsign(previous, incoming) {
  return hasUsefulCallsign(incoming) || !hasUsefulCallsign(previous) ? incoming : previous;
}
