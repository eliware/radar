export const METAR_CACHE_MS = 5 * 60 * 1000;

export function createMetarCache({ now = Date.now, lifetimeMs = METAR_CACHE_MS } = {}) {
  let value;
  let expiresAt = 0;

  return {
    get() {
      return value !== undefined && now() < expiresAt ? value : undefined;
    },
    set(nextValue) {
      value = nextValue;
      expiresAt = now() + lifetimeMs;
    },
  };
}
