import { default as clipPolylineToViewport } from "../clip-polyline.mjs";
import { default as intersectsViewport } from "../intersection.mjs";

function selectVisibleReferenceItem(item, bounds, location, padding) {
  if (item.points?.length > 1) return clipPolylineToViewport(item, bounds, location);
  return intersectsViewport(item, bounds, location, padding) ? [item] : [];
}
export default selectVisibleReferenceItem;
