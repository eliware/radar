export function createAdsbLolPollingRetryPolicy(intervalMs, maxBackoffMs) {
  let failures = 0;
  return {
    recordFailure() {
      failures = Math.min(failures + 1, 6);
    },
    reset() {
      failures = 0;
    },
    delay() {
      return Math.min(maxBackoffMs, intervalMs * 2 ** failures);
    },
  };
}
