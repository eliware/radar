import { expect, jest, test } from "@jest/globals";
import { createWaterTileRequest } from "../../../../src/frontend/water/tile/request.mjs";

const tile = { key: "1/2/3", z: 1, x: 2, y: 3 };
const tileJson = { tiles: ["https://tiles/{z}/{x}/{y}"] };
const response = (ok = true) => ({ ok, arrayBuffer: async () => new ArrayBuffer(0) });

test("fetches a requested tile once and shares its pending response", async () => {
  let release;
  const fetchRef = jest.fn(() => new Promise((resolve) => (release = () => resolve(response()))));
  const request = createWaterTileRequest(fetchRef);
  const first = request.load(tileJson, tile, () => true);
  const second = request.load(tileJson, tile, () => true);
  expect(fetchRef).toHaveBeenCalledTimes(1);
  expect(fetchRef).toHaveBeenCalledWith("https://tiles/1/2/3", { signal: expect.any(AbortSignal) });
  release();
  expect(await Promise.all([first, second])).toEqual([
    expect.any(ArrayBuffer),
    expect.any(ArrayBuffer),
  ]);
});

test("skips missing templates, failed responses, and obsolete results", async () => {
  const request = createWaterTileRequest(jest.fn(async () => response(false)));
  expect(await request.load({}, tile, () => true)).toBeNull();
  expect(await request.load({ tiles: [] }, tile, () => true)).toBeNull();
  expect(await request.load(tileJson, tile, () => true)).toBeNull();
  const obsolete = createWaterTileRequest(jest.fn(async () => response()));
  expect(await obsolete.load(tileJson, tile, () => false)).toBeNull();
});

test("aborts requests that are no longer retained", async () => {
  let signal;
  const request = createWaterTileRequest(
    jest.fn((_url, options) => {
      signal = options.signal;
      return new Promise((_resolve, reject) =>
        signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true }),
      );
    }),
  );
  const pending = request.load(tileJson, tile, () => true);
  request.retain(new Set());
  expect(signal.aborted).toBe(true);
  await expect(pending).rejects.toThrow("aborted");
});
