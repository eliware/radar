import { default as readToggleState } from "../../../toggle-state-storage.mjs";

function getRadarLegendVisibility(toggle, visibility) {
  if (toggle === "aircraftVisible") return true;
  if (toggle === "metarVisible") return readToggleState("metar");
  if (toggle === "flightStripsVisible") return readToggleState("flightStrips");
  return visibility[toggle];
}
export default getRadarLegendVisibility;
