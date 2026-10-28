import { expect, test } from "@jest/globals";
import { createWaterTileStore } from "../../../../src/frontend/water/tile/store.mjs";

test("retains decoded paths and looks them up in tile order", () => {
  const store = createWaterTileStore();
  const first = { key: "1/0/0" };
  const second = { key: "1/1/0" };
  store.set(first.key, [{ id: "A" }]);
  store.set(second.key, [{ id: "B" }, { id: "C" }]);
  expect(store.has(first.key)).toBe(true);
  expect(store.get(second.key)).toEqual([{ id: "B" }, { id: "C" }]);
  expect(store.pathsFor([second, { key: "missing" }, first])).toEqual([
    { id: "B" },
    { id: "C" },
    { id: "A" },
  ]);
});

test("evicts the oldest entry when the configured capacity is exceeded", () => {
  const store = createWaterTileStore(2);
  store.set("oldest", [{ id: "A" }]);
  store.set("middle", [{ id: "B" }]);
  store.set("newest", [{ id: "C" }]);
  expect(store.size).toBe(2);
  expect(store.has("oldest")).toBe(false);
  expect(store.pathsFor([{ key: "middle" }, { key: "newest" }])).toEqual([
    { id: "B" },
    { id: "C" },
  ]);
});
test("returns no paths for an empty or uncached selection", () => {
  const store = createWaterTileStore();
  expect(store.pathsFor([])).toEqual([]);
  expect(store.pathsFor([{ key: "missing" }])).toEqual([]);
});
