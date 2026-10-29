export function createRadarReferenceRetryPolicy(baseDelayMs, maxDelayMs) {
  let failures = 0;
  return {
    recordFailure() {
      failures = Math.min(failures + 1, 8);
    },
    reset() {
      failures = 0;
    },
    delay() {
      return Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, failures - 1));
    },
  };
}
