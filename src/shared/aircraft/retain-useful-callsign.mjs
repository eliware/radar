import { default as hasUsefulCallsign } from "./callsign.mjs";

function retainUsefulCallsign(previous, incoming) {
  return hasUsefulCallsign(incoming) || !hasUsefulCallsign(previous) ? incoming : previous;
}
export default retainUsefulCallsign;
