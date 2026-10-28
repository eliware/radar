export function visibilityText(data) {
  if (data.verticalVisibility != null) return `VV ${data.verticalVisibility} ft`;
  if (!data.visibility) return "—";
  return `${data.visibility.indicator ?? ""}${data.visibility.value}`;
}
