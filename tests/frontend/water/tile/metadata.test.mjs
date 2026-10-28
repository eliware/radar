import { expect, jest, test } from "@jest/globals";
import { createWaterTileMetadataLoader } from "../../../../src/frontend/water/tile/metadata.mjs";

test("fetches and shares tile metadata", async () => {
  const tileJson = { tiles: ["https://tile/{z}/{x}/{y}"] };
  const fetchRef = jest.fn(async () => ({ ok: true, json: async () => tileJson }));
  const metadata = createWaterTileMetadataLoader(fetchRef);
  await expect(metadata.load()).resolves.toBe(tileJson);
  await expect(metadata.load()).resolves.toBe(tileJson);
  expect(fetchRef).toHaveBeenCalledTimes(1);
  expect(fetchRef).toHaveBeenCalledWith("https://tiles.openfreemap.org/planet");
});

test("retries metadata after a failed response", async () => {
  const fetchRef = jest
    .fn()
    .mockResolvedValueOnce({ ok: false })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tiles: [] }) });
  const metadata = createWaterTileMetadataLoader(fetchRef);
  await expect(metadata.load()).rejects.toThrow("Water tile metadata request failed");
  await expect(metadata.load()).resolves.toEqual({ tiles: [] });
  expect(fetchRef).toHaveBeenCalledTimes(2);
});

test("retries after metadata JSON parsing fails", async () => {
  const fetchRef = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => Promise.reject(new Error("bad json")) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ tiles: [] }) });
  const metadata = createWaterTileMetadataLoader(fetchRef);
  await expect(metadata.load()).rejects.toThrow("bad json");
  await expect(metadata.load()).resolves.toEqual({ tiles: [] });
});
