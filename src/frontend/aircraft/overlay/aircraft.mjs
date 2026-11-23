import { default as drawAircraftDisplay } from "../../draw/aircraft/display.mjs";
import { default as projectAircraftDisplayItems } from "../../project/aircraft-display-items.mjs";

function drawAircraftOverlayTargets(
  context,
  aircraft,
  trails,
  location,
  elevationFeet,
  project,
  connected,
  width,
  height,
) {
  const items = projectAircraftDisplayItems(aircraft, trails, location, elevationFeet, project);
  drawAircraftDisplay(context, items, 18, width, height, connected);
}
export default drawAircraftOverlayTargets;
