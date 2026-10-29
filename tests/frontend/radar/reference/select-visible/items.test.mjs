import { expect, test } from "@jest/globals";
import { selectVisibleReferenceItems } from "../../../../../src/frontend/radar/reference/select-visible/items.mjs";

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
  expect(
    selectVisibleReferenceItems(
      items,
      { minX: -10, maxX: 10, minZ: -10, maxZ: 10 },
      {
        latitude: 43,
        longitude: -70,
      },
    ),
  ).toEqual([
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
