import { getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { displayColor } from "./display-color.mjs";
import { drawAircraftEmergencyTag } from "./emergency-tag.mjs";
import { drawAircraftTagLabel } from "./tag-label.mjs";

export function drawAircraftTag(context, tag, fontSize, bright, previousAlpha, now) {
  const color = displayColor(tag.item, bright, now);
  context.fillStyle = color;
  context.strokeStyle = color;
  context.globalAlpha = previousAlpha * getAircraftAgeBrightness(tag.item.receivedAt, now);
  drawAircraftTagLabel(context, tag, fontSize);
  drawAircraftEmergencyTag(context, tag, fontSize);
}
