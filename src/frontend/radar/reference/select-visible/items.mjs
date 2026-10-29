import { selectVisibleReferenceItem } from "./item.mjs";

export function selectVisibleReferenceItems(items, bounds, location, padding = 0) {
  return items.flatMap((item) => selectVisibleReferenceItem(item, bounds, location, padding));
}
