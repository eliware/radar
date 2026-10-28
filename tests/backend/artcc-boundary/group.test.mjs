import { expect, test } from "@jest/globals";
import { groupBoundaries } from "../../../src/backend/artcc-boundary/group.mjs";

test("groups points by boundary identity and keeps only point fields", () => {
  const first = {
    locationId: "ZBW",
    name: "BOSTON",
    altitude: "LOW",
    type: "ARTCC",
    sequence: 1,
    latitude: 43,
    longitude: -70,
  };
  const second = { ...first, sequence: 2, latitude: 44 };
  const other = { ...first, locationId: "ZNY", altitude: "HIGH", latitude: 40 };
  expect(groupBoundaries([first, second, other])).toEqual(
    new Map([
      [
        "ZBW:LOW:ARTCC",
        {
          locationId: "ZBW",
          name: "BOSTON",
          altitude: "LOW",
          type: "ARTCC",
          points: [
            { sequence: 1, latitude: 43, longitude: -70 },
            { sequence: 2, latitude: 44, longitude: -70 },
          ],
        },
      ],
      [
        "ZNY:HIGH:ARTCC",
        {
          locationId: "ZNY",
          name: "BOSTON",
          altitude: "HIGH",
          type: "ARTCC",
          points: [{ sequence: 1, latitude: 40, longitude: -70 }],
        },
      ],
    ]),
  );
});
