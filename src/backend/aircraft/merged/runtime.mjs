import { createMergedAircraftState } from "./aircraft/state.mjs";
import { createMergedAircraftSnapshotPublisher } from "./snapshot/publisher.mjs";
import { createMergedAircraftPublisher } from "./publish.mjs";

export function createMergedAircraftRuntime(
  localFeed,
  remoteSource,
  { setIntervalFn = setInterval, clearIntervalFn = clearInterval } = {},
) {
  const clients = remoteSource.clientState;
  const state = createMergedAircraftState();
  function refresh() {
    state.replaceLocal(localFeed.list());
    state.replaceRemote(remoteSource.list());
  }
  refresh();
  const publish = createMergedAircraftPublisher({ state, clients });
  const publishSnapshots = () => {
    refresh();
    return publish();
  };
  const snapshots = createMergedAircraftSnapshotPublisher(
    publishSnapshots,
    setIntervalFn,
    clearIntervalFn,
  );
  return { clients, state, refresh, publishSnapshots, snapshots };
}
