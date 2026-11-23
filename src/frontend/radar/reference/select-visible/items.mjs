import { default as selectVisibleReferenceItem } from "./item.mjs";

function selectVisibleReferenceItems(items, bounds, location, padding = 0) {
  return items.flatMap((item) => selectVisibleReferenceItem(item, bounds, location, padding));
}
export default selectVisibleReferenceItems;
