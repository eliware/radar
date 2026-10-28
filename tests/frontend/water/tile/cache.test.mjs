import { expect, jest, test } from "@jest/globals";
import { createWaterTileCache } from "../../../../src/frontend/water/tile/cache.mjs";

const tile = { key: "1/2/3", z: 1, x: 2, y: 3 };
const tileJson = { tiles: ["https://tiles/{z}/{x}/{y}"] };
const response = (ok = true) => ({ ok, arrayBuffer: async () => new ArrayBuffer(0) });

test("loads and caches decoded tile paths", async () => {
  const fetchRef = jest.fn(async () => response());
  const cache = createWaterTileCache(fetchRef);
  expect(await cache.load(tileJson, tile, () => true)).toBe(true);
  expect(cache.pathsFor([tile])).toEqual([]);
  expect(await cache.load(tileJson, tile, () => true)).toBe(true);
  expect(fetchRef).toHaveBeenCalledTimes(1);
  expect(fetchRef).toHaveBeenCalledWith("https://tiles/1/2/3", { signal: expect.any(AbortSignal) });
});

test("shares pending requests for a tile", async () => {
  let release;
  const fetchRef = jest.fn(() => new Promise((resolve) => (release = () => resolve(response()))));
  const cache = createWaterTileCache(fetchRef);
  const first = cache.load(tileJson, tile, () => true);
  const second = cache.load(tileJson, tile, () => true);
  expect(fetchRef).toHaveBeenCalledTimes(1);
  release();
  expect(await Promise.all([first, second])).toEqual([true, true]);
});

test("aborts requests for tiles outside the retained view", async () => {
  let rejectFetch;
  let signal;
  const fetchRef = jest.fn((_url, options) => {
    signal = options.signal;
    return new Promise((resolve, reject) => {
      rejectFetch = reject;
      signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    });
  });
  const cache = createWaterTileCache(fetchRef);
  const pending = cache.load(tileJson, tile, () => true);
  cache.retain(new Set());
  expect(signal.aborted).toBe(true);
  await expect(pending).rejects.toThrow("aborted");
  rejectFetch?.(response());
});

test("ignores unsuccessful, obsolete, and template-less tile requests", async () => {
  const fail = createWaterTileCache(jest.fn(async () => response(false)));
  expect(await fail.load(tileJson, tile, () => true)).toBe(false);
  const obsolete = createWaterTileCache(jest.fn(async () => response()));
  expect(await obsolete.load(tileJson, tile, () => false)).toBe(false);
  const missing = createWaterTileCache(jest.fn());
  expect(await missing.load({}, tile, () => true)).toBe(false);
  expect(await missing.load({ tiles: [] }, tile, () => true)).toBe(false);
});
