import { expect, jest, test } from "@jest/globals";
import { createWaterViewLoader } from "../../../src/frontend/water/view-loader.mjs";

function setup({ loadMetadata = async () => ({}), selectTiles = () => [] } = {}) {
  const cache = {
    retain: jest.fn(),
    load: jest.fn(async () => true),
    pathsFor: jest.fn(() => ["path"]),
  };
  return { loader: createWaterViewLoader({ loadMetadata, selectTiles, cache }), cache };
}

test("loads selected tiles, retains the view, and reports the cache paths", async () => {
  const tiles = [{ key: "1/2/3" }];
  const { loader, cache } = setup({ selectTiles: () => tiles });
  const onChange = jest.fn();
  await loader.load({ latitude: 10, longitude: 20 }, 5, onChange);
  expect(cache.retain).toHaveBeenCalledWith(new Set(["1/2/3"]));
  expect(cache.load).toHaveBeenCalledWith({}, tiles[0], expect.any(Function));
  expect(onChange).toHaveBeenCalledWith(["path"], true);
});

test("suppresses canceled views and reports metadata failures", async () => {
  let rejectMetadata;
  const pending = setup({
    loadMetadata: () => new Promise((_resolve, reject) => (rejectMetadata = reject)),
  });
  const staleChange = jest.fn();
  const pendingLoad = pending.loader.load({}, 1, staleChange);
  pending.loader.cancel();
  rejectMetadata(new Error("offline"));
  await pendingLoad;
  expect(staleChange).not.toHaveBeenCalled();

  const failed = setup({
    loadMetadata: async () => {
      throw new Error("offline");
    },
  });
  const onChange = jest.fn();
  await failed.loader.load({}, 1, onChange);
  expect(onChange).toHaveBeenCalledWith([], false);
});
