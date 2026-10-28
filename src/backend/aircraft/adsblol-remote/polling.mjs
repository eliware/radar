import { requestAdsbLolCircle } from "./request/circle.mjs";
import { createAdsbLolPoller } from "./poller.mjs";

export function createAdsbLolRemotePolling({
  location,
  request,
  pollingPolicy,
  aircraft,
  publish,
  hasClients,
  setTimeoutFn,
  clearTimeoutFn,
  onError,
  intervalMs,
}) {
  async function poll(isCurrent) {
    if (!Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude)) return;
    const records = await requestAdsbLolCircle(request, location, pollingPolicy().radiusNm);
    if (!isCurrent()) return;
    records.forEach((item) => aircraft.update(item));
    publish();
  }

  return createAdsbLolPoller({
    poll,
    hasClients,
    setTimeoutFn,
    clearTimeoutFn,
    onError,
    intervalMs,
  });
}
