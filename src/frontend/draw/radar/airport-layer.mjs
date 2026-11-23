import { default as drawAirportMarkers } from "../airport/markers.mjs";
import { default as drawAirspaceRings } from "../airspace-rings.mjs";
import { default as drawAirportRunways } from "../airport/runways.mjs";

function drawAirportLayer(
  context,
  airports,
  project,
  runwayVisibility,
  referenceVisibility,
  airspaceRingsVisible,
) {
  const airportsVisible = referenceVisibility.airportsVisible;
  if (airportsVisible && airspaceRingsVisible) drawAirspaceRings(context, airports, project);
  drawAirportRunways(
    context,
    airports,
    project,
    airportsVisible && runwayVisibility.runwaysVisible,
    airportsVisible && runwayVisibility.extensionsVisible,
    airportsVisible && runwayVisibility.baseLegsVisible,
  );
  if (airportsVisible) drawAirportMarkers(context, airports, project);
}
export default drawAirportLayer;
