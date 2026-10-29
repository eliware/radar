import { clipPolylineToViewport } from "../clip-polyline.mjs";
import { intersectsViewport } from "../intersection.mjs";

export function selectVisibleReferenceItem(item, bounds, location, padding) {
  if (item.points?.length > 1) return clipPolylineToViewport(item, bounds, location);
  return intersectsViewport(item, bounds, location, padding) ? [item] : [];
}
