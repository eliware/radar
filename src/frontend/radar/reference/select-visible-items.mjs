import { clipPolylineToViewport } from "./clip-polyline.mjs";
import { intersectsViewport } from "./intersection.mjs";

export function selectVisibleReferenceItems(items, bounds, location, padding = 0) {
  return items.flatMap((item) => {
    if (item.points?.length > 1) return clipPolylineToViewport(item, bounds, location);
    return intersectsViewport(item, bounds, location, padding) ? [item] : [];
  });
}
