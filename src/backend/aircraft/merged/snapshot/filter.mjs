function filterAircraftSnapshot(aircraft, radiusNm, localOnly) {
  return aircraft.filter(
    (item) =>
      Number.isFinite(item.distanceNauticalMiles) &&
      item.distanceNauticalMiles <= radiusNm &&
      (!localOnly || !item.remoteOnly),
  );
}
export default filterAircraftSnapshot;
