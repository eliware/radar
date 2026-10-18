import { expect, test } from "@jest/globals";
import {
  createRadarViewport,
  intersectsViewport,
} from "../../../../src/frontend/radar/reference/viewport.mjs";

const home = { latitude: 43, longitude: -70 };

test("viewport bounds include the rotated mobile screen and cap fetch range", () => {
  const bounds = createRadarViewport(400, 800, 20, 0, 0, 0);
  expect(bounds.minX).toBeLessThan(-20);
  expect(bounds.maxX).toBeGreaterThan(20);
  expect(bounds.maxRangeNm).toBeLessThan(100);
  expect(createRadarViewport(400, 800, 300, 0, 0, 0).maxRangeNm).toBe(300);
});

test("viewport intersection keeps crossing paths and drops distant geometry", () => {
  const bounds = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
  expect(
    intersectsViewport(
      {
        points: [
          { x: -20, z: 0 },
          { x: 20, z: 0 },
        ],
      },
      bounds,
      home,
    ),
  ).toBe(true);
  expect(
    intersectsViewport(
      {
        points: [
          { x: 20, z: 20 },
          { x: 30, z: 30 },
        ],
      },
      bounds,
      home,
    ),
  ).toBe(false);
  expect(
    intersectsViewport(
      {
        points: [
          { x: 0, z: 20 },
          { x: 5, z: 20 },
        ],
      },
      bounds,
      home,
    ),
  ).toBe(false);
  expect(intersectsViewport({ latitude: 43, longitude: -70 }, bounds, home)).toBe(true);
  expect(intersectsViewport({ latitude: 43 }, bounds, home)).toBe(false);
});

test("viewport padding retains airport centered airspace just beyond the view", () => {
  const bounds = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };
  expect(intersectsViewport({ latitude: 43, longitude: -69.6 }, bounds, home, 20)).toBe(true);
});
