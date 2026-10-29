import { createRadarReferenceRetryPolicy } from "./retry-policy.mjs";

const NEXT_RANGE_DELAY_MS = 180;

export function createRadarReferenceRequestScheduler(fetchRange, onLoaded) {
  let loadedThrough = 0;
  let requestedThrough = 0;
  let timer;
  let loading;
  const retryPolicy = createRadarReferenceRetryPolicy(NEXT_RANGE_DELAY_MS, 30_000);

  function run() {
    const start = loadedThrough;
    const end = requestedThrough;
    requestedThrough = start;
    loading = fetchRange(start, end)
      .then((collections) => {
        loadedThrough = end;
        retryPolicy.reset();
        onLoaded(collections);
      })
      .catch(() => {
        requestedThrough = Math.max(requestedThrough, end);
        retryPolicy.recordFailure();
      })
      .finally(() => {
        loading = null;
        if (requestedThrough > loadedThrough) {
          timer = setTimeout(() => ((timer = null), run()), retryPolicy.delay());
        }
      });
  }

  return {
    get loadedThrough() {
      return loadedThrough;
    },
    request(target) {
      requestedThrough = Math.max(requestedThrough, target);
      if (loading || timer || requestedThrough <= loadedThrough) return;
      if (loadedThrough) timer = setTimeout(() => ((timer = null), run()), NEXT_RANGE_DELAY_MS);
      else run();
    },
  };
}
