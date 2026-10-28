export function createRadarReferenceViewApplier(cache, scene, location, delay = 80) {
  let timer;
  return {
    schedule(bounds) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        cache.apply(scene, bounds, location);
      }, delay);
    },
    cancel() {
      clearTimeout(timer);
      timer = undefined;
    },
  };
}
