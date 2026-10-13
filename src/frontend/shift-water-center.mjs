export function shiftWaterCenter(location, eastNm, northNm) {
  if (!location) return null;
  const latitude = location.latitude + northNm / 60;
  const longitude =
    location.longitude +
    eastNm / (60 * Math.max(0.05, Math.cos((location.latitude * Math.PI) / 180)));
  return { latitude, longitude };
}
