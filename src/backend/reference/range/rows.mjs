export function rowsWithinBounds(statement, location, maxRangeNm) {
  const latitudeDelta = maxRangeNm / 60;
  const longitudeDelta =
    maxRangeNm / (60 * Math.max(0.01, Math.cos((location.latitude * Math.PI) / 180)));
  return statement.all(
    Math.max(-90, location.latitude - latitudeDelta),
    Math.min(90, location.latitude + latitudeDelta),
    Math.max(-180, location.longitude - longitudeDelta),
    Math.min(180, location.longitude + longitudeDelta),
  );
}
