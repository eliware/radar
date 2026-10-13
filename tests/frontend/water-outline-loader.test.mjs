import { expect, jest, test } from "@jest/globals";
import { createWaterOutlineLoader } from "../../src/frontend/water-outline-loader.mjs";

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
  expect(onChange).toHaveBeenCalledWith([]);
  loader.cancel();
});

test("returns an empty layer when metadata fails or has no tile template", async () => {
  const fail = createWaterOutlineLoader(jest.fn(async () => ({ ok: false })));
  const failed = jest.fn();
  await fail.load({ latitude: 43, longitude: -70 }, 10, failed);
  expect(failed).toHaveBeenCalledWith([]);
  const empty = createWaterOutlineLoader(jest.fn(async () => response({ tiles: [] })));
  const loaded = jest.fn();
  await empty.load({ latitude: 43, longitude: -70 }, 10, loaded);
  expect(loaded).toHaveBeenCalledWith([]);
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

test("reuses pending tile requests and ignores failed tile responses", async () => {
  let tileCalls = 0;
  const fetchRef = jest.fn(async (url) => {
    if (url.endsWith("/planet")) return response({ tiles: ["https://tile/{z}/{x}/{y}"] });
    tileCalls += 1;
    await new Promise((resolve) => setTimeout(resolve, 2));
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
  expect(onChange).toHaveBeenCalledWith([]);
});

test("evicts old tile data and retries metadata after a request failure", async () => {
  let metadataCalls = 0;
  const fetchRef = jest.fn(async (url) => {
    if (url.endsWith("/planet")) {
      metadataCalls += 1;
      return metadataCalls === 1
        ? { ok: false }
        : response({ tiles: ["https://tile/{z}/{x}/{y}"] });
    }
    return response(null, new ArrayBuffer(0));
  });
  const loader = createWaterOutlineLoader(fetchRef);
  await loader.load({ latitude: 43.8, longitude: -70.3 }, 1, jest.fn());
  for (let index = 0; index < 40; index += 1) {
    await loader.load({ latitude: 43 + index * 0.1, longitude: -70.3 }, 1, jest.fn());
  }
  expect(metadataCalls).toBe(2);
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
  expect(onChange).toHaveBeenCalledWith([]);
});

test("uses the global fetch function by default", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = jest.fn(async () => response({ tiles: [] }));
  const loaded = jest.fn();
  await createWaterOutlineLoader().load({ latitude: 43, longitude: -70 }, 10, loaded);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  expect(loaded).toHaveBeenCalledWith([]);
  globalThis.fetch = original;
});

function response(body, buffer) {
  return { ok: true, json: async () => body, arrayBuffer: async () => buffer };
}
