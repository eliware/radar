function createWaterTileUrl(tileJson, tile) {
  const template = tileJson.tiles?.[0];
  if (!template) return null;
  return template.replace("{z}", tile.z).replace("{x}", tile.x).replace("{y}", tile.y);
}
export default createWaterTileUrl;
