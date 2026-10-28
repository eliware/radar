const categories = new Set(["VFR", "MVFR", "IFR", "LIFR"]);

export function isMetarCategory(category) {
  return categories.has(category);
}
