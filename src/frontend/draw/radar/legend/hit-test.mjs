import { radarLegendLayout } from "./entries.mjs";

export function findRadarLegendToggle(width, height, x, y, topInset = 0) {
  return radarLegendLayout(width, height, topInset).find(
    ({ entry, x: left, y: top }) =>
      entry[4] && x >= left - 8 && x <= left + 108 && y >= top - 8 && y <= top + 8,
  )?.entry[4];
}
