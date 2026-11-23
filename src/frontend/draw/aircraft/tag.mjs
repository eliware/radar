import { default as getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { default as displayColor } from "./display-color.mjs";
import { default as drawAircraftEmergencyTag } from "./emergency-tag.mjs";
import { default as drawAircraftTagLabel } from "./tag-label.mjs";

function drawAircraftTag(context, tag, fontSize, bright, previousAlpha, now) {
  const color = displayColor(tag.item, bright, now);
  context.fillStyle = color;
  context.strokeStyle = color;
  context.globalAlpha = previousAlpha * getAircraftAgeBrightness(tag.item.receivedAt, now);
  drawAircraftTagLabel(context, tag, fontSize);
  drawAircraftEmergencyTag(context, tag, fontSize);
}
export default drawAircraftTag;
