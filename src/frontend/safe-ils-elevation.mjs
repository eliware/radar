function safeIlsElevation(point) {
  return Number.isFinite(point.elevationFeet) ? point.elevationFeet : 0;
}
export default safeIlsElevation;
