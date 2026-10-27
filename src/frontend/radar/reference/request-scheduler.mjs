const NEXT_RANGE_DELAY_MS = 180;

export function createRadarReferenceRequestScheduler(fetchRange, onLoaded) {
  let loadedThrough = 0;
  let requestedThrough = 0;
  let timer;
  let loading;
  let failures = 0;

  function run() {
    const start = loadedThrough;
    const end = requestedThrough;
    requestedThrough = start;
    loading = fetchRange(start, end)
      .then((collections) => {
        loadedThrough = end;
        failures = 0;
        onLoaded(collections);
      })
      .catch(() => {
        requestedThrough = Math.max(requestedThrough, end);
        failures = Math.min(failures + 1, 8);
      })
      .finally(() => {
        loading = null;
        if (requestedThrough > loadedThrough) {
          const delay = Math.min(30_000, NEXT_RANGE_DELAY_MS * 2 ** Math.max(0, failures - 1));
          timer = setTimeout(() => ((timer = null), run()), delay);
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
