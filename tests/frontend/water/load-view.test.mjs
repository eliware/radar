import { expect, jest, test } from "@jest/globals";
import { createWaterViewSource } from "../../../src/frontend/water/load-view.mjs";

test("loads tile metadata and selects tiles for a requested view", async () => {
  const tileJson = { tiles: ["https://tile/{z}/{x}/{y}"] };
  const fetchRef = jest.fn(async () => ({ ok: true, json: async () => tileJson }));
  const source = createWaterViewSource(fetchRef);
  const result = await source.load({ latitude: 43, longitude: -70 }, 10);
  expect(result.tileJson).toBe(tileJson);
  expect(result.tiles.length).toBeGreaterThan(0);
  expect(result.tiles.every(({ z, key }) => key.startsWith(`${z}/`))).toBe(true);
  expect(fetchRef).toHaveBeenCalledTimes(1);
});
test("propagates metadata failures to the view coordinator", async () => {
  const source = createWaterViewSource(jest.fn(async () => ({ ok: false })));
  await expect(source.load({ latitude: 43, longitude: -70 }, 10)).rejects.toThrow(
    "Water tile metadata request failed",
  );
});
