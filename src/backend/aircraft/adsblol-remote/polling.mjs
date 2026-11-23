import { default as requestAndApplyAdsbLolCircle } from "./polling/request.mjs";
import { default as createAdsbLolPoller } from "./poller.mjs";

function createAdsbLolRemotePolling({
  location,
  request,
  pollingPolicy,
  aircraft,
  publish,
  hasClients,
  setTimeoutFn,
  clearTimeoutFn,
  onError,
  onRequest,
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
      onRequest,
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
export default createAdsbLolRemotePolling;
