import { expect, test } from "@jest/globals";
import {
  intersectsViewport,
  selectVisibleReferenceItems,
} from "../../../../src/frontend/radar/reference/intersection.mjs";

const home = { latitude: 43, longitude: -70 };
const bounds = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };

test("intersection keeps crossing paths and drops distant geometry", () => {
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

test("padding retains airport centered airspace just beyond the view", () => {
  expect(intersectsViewport({ latitude: 43, longitude: -69.6 }, bounds, home, 20)).toBe(true);
});

test("selects visible points and clips visible portions of line geometry", () => {
  const items = [
    { id: "inside", latitude: 43, longitude: -70 },
    { id: "outside", latitude: 44, longitude: -70 },
    {
      id: "crossing",
      points: [
        { x: -20, z: 0 },
        { x: 20, z: 0 },
      ],
    },
  ];
  expect(selectVisibleReferenceItems(items, bounds, home)).toEqual([
    items[0],
    {
      id: "crossing",
      points: [
        { x: -10, z: 0, viewportCut: true },
        { x: 10, z: 0, viewportCut: true },
      ],
    },
  ]);
});
