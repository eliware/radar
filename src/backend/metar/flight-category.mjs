const labels = ["VFR", "MVFR", "IFR", "LIFR"];

export function metarFlightCategory(data) {
  const visibility = Number.isFinite(data.visibility?.value)
    ? categoryForVisibility(data.visibility.value)
    : data.cavok
      ? 0
      : null;
  const ceiling = data.verticalVisibility ?? lowestCeiling(data.clouds);
  const ceilingCategory = ceiling != null ? categoryForCeiling(ceiling) : data.cavok ? 0 : null;
  const categories = [visibility, ceilingCategory].filter((value) => value != null);
  return categories.length ? labels[Math.max(...categories)] : null;
}

function categoryForVisibility(miles) {
  if (miles < 1) return 3;
  if (miles < 3) return 2;
  if (miles <= 5) return 1;
  return 0;
}

function categoryForCeiling(feet) {
  if (feet < 500) return 3;
  if (feet < 1000) return 2;
  if (feet <= 3000) return 1;
  return 0;
}

function lowestCeiling(clouds = []) {
  const heights = clouds
    .filter(({ quantity }) => ["BKN", "OVC"].includes(quantity))
    .map(({ height }) => height)
    .filter(Number.isFinite);
  return heights.length ? Math.min(...heights) : null;
}
