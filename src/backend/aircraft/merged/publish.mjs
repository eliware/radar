export function createMergedAircraftPublisher({ state, clients }) {
  return function publishSnapshots() {
    const aircraft = state.list();
    const localFurthestDistanceNm = state.localFurthestDistanceNm();
    clients.publish(aircraft, localFurthestDistanceNm);
  };
}
