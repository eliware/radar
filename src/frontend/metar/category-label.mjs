const labels = ["VFR", "MVFR", "IFR", "LIFR"];

export function metarCategoryLabel(category) {
  if (!labels.includes(category)) return "—";
  return `<span class="flight-category flight-category-${category.toLowerCase()}">${category}</span>`;
}
