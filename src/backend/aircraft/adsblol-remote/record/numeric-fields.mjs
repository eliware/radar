function optionalNumber(name, value) {
  return Number.isFinite(value) ? { [name]: value } : {};
}

function mapRemoteAircraftNumericFields(item) {
  return {
    ...optionalNumber("altitudeFeet", item.alt_baro ?? item.alt_geom),
    ...optionalNumber("groundSpeedKnots", item.gs),
    ...optionalNumber("trackDegrees", item.track ?? item.true_heading ?? item.dir),
    ...optionalNumber("verticalRateFeetPerMinute", item.baro_rate ?? item.geom_rate),
  };
}
export default mapRemoteAircraftNumericFields;
