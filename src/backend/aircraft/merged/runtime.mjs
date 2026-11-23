import { default as createMergedAircraftState } from "./aircraft/state.mjs";
import { default as createMergedAircraftSnapshotPublisher } from "./snapshot/publisher.mjs";
import { default as createMergedAircraftPublisher } from "./publish.mjs";

function createMergedAircraftRuntime(
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
export default createMergedAircraftRuntime;
