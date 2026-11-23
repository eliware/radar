import { default as isMetarCategory } from "./category.mjs";

function metarCategoryLabel(category) {
  if (!isMetarCategory(category)) return "—";
  return `<span class="flight-category flight-category-${category.toLowerCase()}">${category}</span>`;
}
export default metarCategoryLabel;
