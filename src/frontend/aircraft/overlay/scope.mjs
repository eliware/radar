import { RADAR_SCOPE_RADIUS_RATIO } from "../../radar/range.mjs";
import { drawRadarScale } from "../../draw/radar/scale.mjs";
import { drawRadarScaleLegend } from "../../draw/radar/legend/draw-scale-legend.mjs";
import { drawCameraReadout } from "../overlay/readout.mjs";

export function drawAircraftOverlayScope(
  context,
  camera,
  location,
  elevationFeet,
  range,
  width,
  height,
  connected,
  visibility,
) {
  drawRadarScaleLegend(
    context,
    width,
    height,
    connected,
    visibility.ilsVisible,
    visibility.procedureVisibility,
    visibility.waterVisible,
    visibility.airwayVisibility,
    visibility.runwayVisibility,
    visibility.referenceVisibility,
  );
  drawRadarScale(context, range, Math.min(width, height) * RADAR_SCOPE_RADIUS_RATIO, height);
  drawCameraReadout(context, camera, location, elevationFeet, width);
}
