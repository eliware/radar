import { default as clampWaterLatitude } from "./latitude.mjs";

function latitudeToWaterTile(latitude, zoom) {
  const radians = (clampWaterLatitude(latitude) * Math.PI) / 180;
  return Math.floor(((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2) * 2 ** zoom);
}
export default latitudeToWaterTile;
