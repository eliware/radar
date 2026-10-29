import { expect, test } from "@jest/globals";
import { selectVisibleReferenceItem } from "../../../../../src/frontend/radar/reference/select-visible/item.mjs";

test("selects a point reference by viewport intersection", () => {
  const point = { id: "inside", latitude: 43, longitude: -70 };
  expect(
    selectVisibleReferenceItem(
      point,
      { minX: -1, maxX: 1, minZ: -1, maxZ: 1 },
      { latitude: 43, longitude: -70 },
      0,
    ),
  ).toEqual([point]);
});
