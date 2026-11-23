function selectWaterTileLayer(vectorTile) {
  return vectorTile.layers?.water ?? null;
}
export default selectWaterTileLayer;
