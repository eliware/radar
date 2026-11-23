function compareAircraftDistance(left, right) {
  return (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity);
}
export default compareAircraftDistance;
