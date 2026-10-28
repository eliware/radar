const SNAPSHOT_INTERVAL_MS = 1000;

export function createMergedAircraftSnapshotPublisher(
  publishSnapshots,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
) {
  let timer;
  return {
    start() {
      if (timer === undefined) timer = setIntervalFn(publishSnapshots, SNAPSHOT_INTERVAL_MS);
    },
    stop() {
      if (timer === undefined) return;
      clearIntervalFn(timer);
      timer = undefined;
    },
  };
}
