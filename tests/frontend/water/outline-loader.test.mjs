import { expect, jest, test } from "@jest/globals";
import { createWaterOutlineLoader } from "../../../src/frontend/water/outline-loader.mjs";

test("loads visible tiles once and reuses cached tile data", async () => {
  const fetchRef = jest.fn(async (url) =>
    url.endsWith("/planet")
      ? response({ tiles: ["https://tile/{z}/{x}/{y}.pbf"] })
      : response(null, new ArrayBuffer(0)),
  );
  const loader = createWaterOutlineLoader(fetchRef);
  const onChange = jest.fn();
  await loader.load({ latitude: 43.8, longitude: -70.3 }, 1, onChange);
  const tileCalls = fetchRef.mock.calls.length - 1;
  await loader.load({ latitude: 43.8, longitude: -70.3 }, 1, onChange);
  expect(fetchRef).toHaveBeenCalledTimes(tileCalls + 1);
  expect(onChange).toHaveBeenCalledWith([], true);
  loader.cancel();
});

test("returns an empty layer when metadata fails or has no tile template", async () => {
  const fail = createWaterOutlineLoader(jest.fn(async () => ({ ok: false })));
  const failed = jest.fn();
  await fail.load({ latitude: 43, longitude: -70 }, 10, failed);
  expect(failed).toHaveBeenCalledWith([], false);
  const empty = createWaterOutlineLoader(jest.fn(async () => response({ tiles: [] })));
  const loaded = jest.fn();
  await empty.load({ latitude: 43, longitude: -70 }, 10, loaded);
  expect(loaded).toHaveBeenCalledWith([], false);
});

test("does not publish stale results after cancel", async () => {
  const fetchRef = jest.fn(async () => response({ tiles: [] }));
  const loader = createWaterOutlineLoader(fetchRef);
  const onChange = jest.fn();
  const pending = loader.load({ latitude: 43, longitude: -70 }, 5, onChange);
  loader.cancel();
  await pending;
  expect(onChange).not.toHaveBeenCalled();
});

test("aborts obsolete tile requests and avoids caching their results", async () => {
  const calls = [];
  const fetchRef = jest.fn((url, { signal } = {}) => {
    if (url.endsWith("/planet"))
      return Promise.resolve(response({ tiles: ["https://tile/{z}/{x}/{y}"] }));
    calls.push({ url, signal });
    if (calls.length === 1) {
      return new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
        if (signal.aborted) reject(new Error("aborted"));
      });
    }
    return Promise.resolve(response(null, new ArrayBuffer(0)));
  });
  const loader = createWaterOutlineLoader(fetchRef);
  const oldView = loader.load({ latitude: 43, longitude: -70 }, 1, jest.fn());
  while (!calls.length) await Promise.resolve();
  const oldTileCalls = calls.length;
  const newView = loader.load({ latitude: 10, longitude: 10 }, 1, jest.fn());
  await Promise.resolve();
  await Promise.all([oldView, newView]);
  expect(calls.slice(0, oldTileCalls).every(({ signal }) => signal.aborted)).toBe(true);
  const oldUrls = new Set(calls.slice(0, oldTileCalls).map(({ url }) => url));
  const beforeRetry = calls.length;
  await loader.load({ latitude: 43, longitude: -70 }, 1, jest.fn());
  expect(calls.slice(beforeRetry).some(({ url }) => oldUrls.has(url))).toBe(true);
});

test("shares pending tile requests for identical views", async () => {
  let tileCalls = 0;
  const releases = [];
  const fetchRef = jest.fn((url) => {
    if (url.endsWith("/planet"))
      return Promise.resolve(response({ tiles: ["https://tile/{z}/{x}/{y}"] }));
    tileCalls += 1;
    return new Promise((resolve) =>
      releases.push(() => resolve(response(null, new ArrayBuffer(0)))),
    );
  });
  const loader = createWaterOutlineLoader(fetchRef);
  const center = { latitude: 43, longitude: -70 };
  const first = loader.load(center, 1, jest.fn());
  while (!tileCalls) await Promise.resolve();
  const count = tileCalls;
  const second = loader.load(center, 1, jest.fn());
  for (let turn = 0; turn < 5; turn += 1) await Promise.resolve();
  expect(tileCalls).toBe(count);
  releases.forEach((release) => release());
  await Promise.all([first, second]);
});

test("reuses pending tile requests and ignores failed tile responses", async () => {
  let tileCalls = 0;
  const fetchRef = jest.fn(async (url) => {
    if (url.endsWith("/planet")) return response({ tiles: ["https://tile/{z}/{x}/{y}"] });
    tileCalls += 1;
    await Promise.resolve();
    return { ok: false };
  });
  const loader = createWaterOutlineLoader(fetchRef);
  const onChange = jest.fn();
  await Promise.all([
    loader.load({ latitude: 43.8, longitude: -70.3 }, 1, onChange),
    loader.load({ latitude: 43.8, longitude: -70.3 }, 1, onChange),
  ]);
  expect(tileCalls).toBeGreaterThan(0);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith([], false);
});

test("evicts old tile data after loading many different views", async () => {
  const tileCalls = [];
  const fetchRef = jest.fn(async (url) => {
    if (url.endsWith("/planet")) return response({ tiles: ["https://tile/{z}/{x}/{y}"] });
    tileCalls.push(url);
    return response(null, new ArrayBuffer(0));
  });
  const loader = createWaterOutlineLoader(fetchRef);
  const firstCenter = { latitude: 43.8, longitude: -70.3 };
  await loader.load(firstCenter, 1, jest.fn());
  for (let index = 0; index < 40; index += 1) {
    await loader.load({ latitude: 20 + index, longitude: -70.3 }, 1, jest.fn());
  }
  const beforeReload = tileCalls.length;
  await loader.load(firstCenter, 1, jest.fn());
  expect(tileCalls.length).toBeGreaterThan(beforeReload);
});

test("does not publish errors from canceled tile requests", async () => {
  let rejectMetadata;
  const fetchRef = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        rejectMetadata = reject;
      }),
  );
  const loader = createWaterOutlineLoader(fetchRef);
  const onChange = jest.fn();
  const loading = loader.load({ latitude: 43, longitude: -70 }, 5, onChange);
  loader.cancel();
  rejectMetadata(new Error("offline"));
  await loading;
  expect(onChange).not.toHaveBeenCalled();
});

test("keeps loading when one tile request throws", async () => {
  const fetchRef = jest.fn(async (url) => {
    if (url.endsWith("/planet")) return response({ tiles: ["https://tile/{z}/{x}/{y}"] });
    throw new Error("offline");
  });
  const loader = createWaterOutlineLoader(fetchRef);
  const onChange = jest.fn();
  await loader.load({ latitude: 43.8, longitude: -70.3 }, 1, onChange);
  expect(onChange).toHaveBeenCalledWith([], false);
});

test("uses the global fetch function by default", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = jest.fn(async () => response({ tiles: [] }));
  const loaded = jest.fn();
  await createWaterOutlineLoader().load({ latitude: 43, longitude: -70 }, 10, loaded);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  expect(loaded).toHaveBeenCalledWith([], false);
  globalThis.fetch = original;
});

function response(body, buffer) {
  return { ok: true, json: async () => body, arrayBuffer: async () => buffer };
}
