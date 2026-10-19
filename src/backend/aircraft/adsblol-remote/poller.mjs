export function createAdsbLolPoller({
  poll,
  hasClients,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  onError = () => {},
  intervalMs = 6000,
  maxBackoffMs = 300_000,
}) {
  let timer;
  let pending = false;
  let failures = 0;
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
    try {
      await poll(() => token === generation && hasClients() && !closed);
      failures = 0;
    } catch (error) {
      if (token === generation && !closed) {
        failures = Math.min(failures + 1, 6);
        onError(error);
      }
    } finally {
      pending = false;
      if (!closed && hasClients()) schedule(token === generation ? retryDelay() : intervalMs);
    }
  }
  function retryDelay() {
    return Math.min(maxBackoffMs, intervalMs * 2 ** failures);
  }
  function stop() {
    if (timer !== undefined) clearTimeoutFn(timer);
    timer = undefined;
    generation += 1;
    failures = 0;
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
