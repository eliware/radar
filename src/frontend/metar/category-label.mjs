import { isMetarCategory } from "./category.mjs";

export function metarCategoryLabel(category) {
  if (!isMetarCategory(category)) return "—";
  return `<span class="flight-category flight-category-${category.toLowerCase()}">${category}</span>`;
}
