import { expect, jest, test } from "@jest/globals";
import { loadMapOutlines } from "../../src/backend/map-outline-data.mjs";

test("loads the bundled Natural Earth outline data", () => {
  const outlines = loadMapOutlines();
  expect(outlines.coastline.length).toBeGreaterThan(0);
  expect(outlines.lakes.length).toBeGreaterThan(0);
  expect(outlines.coastline[0][0]).toHaveLength(2);
});

test("reads and decompresses an injected outline asset", () => {
  const asset = Buffer.from("packed");
  const read = jest.fn(() => asset);
  const decompress = jest.fn(() => Buffer.from('{"coastline":[],"lakes":[]}'));
  expect(loadMapOutlines(read, decompress)).toEqual({ coastline: [], lakes: [] });
  expect(read).toHaveBeenCalledWith(expect.any(URL));
  expect(decompress).toHaveBeenCalledWith(asset);
});
