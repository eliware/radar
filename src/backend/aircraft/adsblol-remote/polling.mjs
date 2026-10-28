import { requestAndApplyAdsbLolCircle } from "./polling/request.mjs";
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
    await requestAndApplyAdsbLolCircle({
      request,
      location,
      radiusNm: pollingPolicy().radiusNm,
      isCurrent,
      aircraft,
      publish,
    });
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
