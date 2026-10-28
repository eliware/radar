export function createWaterViewLoader({ loadView, cache }) {
  let generation = 0;
  let requestedKeys = new Set();
  return {
    async load(center, rangeNm, onChange) {
      const current = ++generation;
      try {
        const { tileJson, tiles } = await loadView(center, rangeNm);
        if (current !== generation) return;
        requestedKeys = new Set(tiles.map((tile) => tile.key));
        cache.retain(requestedKeys);
        const results = await Promise.all(
          tiles.map((tile) =>
            cache.load(tileJson, tile, () => requestedKeys.has(tile.key)).catch(() => false),
          ),
        );
        if (current === generation) onChange(cache.pathsFor(tiles), results.every(Boolean));
      } catch {
        if (current === generation) onChange([], false);
      }
    },
    cancel() {
      generation += 1;
    },
  };
}
