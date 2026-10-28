const labels = ["VFR", "MVFR", "IFR", "LIFR"];

export { metarFlightCategory } from "./fields/category.mjs";

export function metarCategoryLabel(category) {
  if (!labels.includes(category)) return "—";
  return `<span class="flight-category flight-category-${category.toLowerCase()}">${category}</span>`;
}
