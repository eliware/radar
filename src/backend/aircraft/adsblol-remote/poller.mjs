import { createAdsbLolPollingRetryPolicy } from "./polling/retry-policy.mjs";

export function createAdsbLolPoller({
  poll,
  hasClients,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  onError = () => {},
  intervalMs = 15_000,
  maxBackoffMs = 300_000,
}) {
  let timer;
  let pending = false;
  const retryPolicy = createAdsbLolPollingRetryPolicy(intervalMs, maxBackoffMs);
  let generation = 0;
  let closed = false;
  function schedule(delay) {
    if (closed || !hasClients() || timer !== undefined) return;
    timer = setTimeoutFn(() => ((timer = undefined), run()), delay);
  }
  async function run() {
    if (closed || !hasClients() || pending) return;
    pending = true;
    const token = generation;
    let retryDelayMs = intervalMs;
    try {
      await poll(() => token === generation && hasClients() && !closed);
      retryPolicy.reset();
    } catch (error) {
      if (token === generation && !closed) {
        retryPolicy.recordFailure();
        retryDelayMs = retryPolicy.delay();
        if (Number.isFinite(error?.retryAfterMs) && error.retryAfterMs >= 0) {
          retryDelayMs = error.retryAfterMs;
        }
        onError(error);
      }
    } finally {
      pending = false;
      if (!closed && hasClients()) schedule(token === generation ? retryDelayMs : intervalMs);
    }
  }
  function stop() {
    if (timer !== undefined) clearTimeoutFn(timer);
    timer = undefined;
    generation += 1;
    retryPolicy.reset();
  }
  return {
    start: () => schedule(intervalMs),
    stop,
    close() {
      closed = true;
      stop();
    },
  };
}
