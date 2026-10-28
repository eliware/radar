export function cloudText(data) {
  if (data.verticalVisibility != null) return "Vertical visibility";
  if (data.clouds.length) return data.clouds.map(cloudLayerText).join(" ");
  return data.cavok ? "CAVOK" : "—";
}

function cloudLayerText({ quantity, height, type }) {
  const altitude = height == null ? "—" : String(Math.round(height / 100)).padStart(3, "0");
  return `${quantity}${altitude}${type ?? ""}`;
}
