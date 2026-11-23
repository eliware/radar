const categories = new Set(["VFR", "MVFR", "IFR", "LIFR"]);

function isMetarCategory(category) {
  return categories.has(category);
}
export default isMetarCategory;
