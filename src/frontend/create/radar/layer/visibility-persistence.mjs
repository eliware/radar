import { default as readToggleState } from "../../../toggle-state-storage.mjs";

const LAYER_KEYS = [
  "ils",
  "sid",
  "star",
  "airway-Q",
  "airway-J",
  "airway-V",
  "runways",
  "extensions",
  "baseLegs",
  "airports",
  "navaids",
];

function readSavedLayerVisibility() {
  return Object.fromEntries(LAYER_KEYS.map((key) => [key, readToggleState(key)]));
}
export default readSavedLayerVisibility;
