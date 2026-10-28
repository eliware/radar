import { layoutAircraftTags } from "../../layout-aircraft-tags.mjs";
import { drawAircraftTag } from "./tag.mjs";

export function drawAircraftTags(
  context,
  aircraft,
  fontSize,
  width,
  height,
  bright,
  previousAlpha,
  now,
) {
  context.font = `${fontSize}px Consolas, "Courier New", monospace`;
  for (const tag of layoutAircraftTags(context, aircraft, fontSize, width, height)) {
    drawAircraftTag(context, tag, fontSize, bright, previousAlpha, now);
  }
}
