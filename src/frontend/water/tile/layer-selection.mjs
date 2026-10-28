export function selectWaterTileLayer(vectorTile) {
  return vectorTile.layers?.water ?? null;
}
