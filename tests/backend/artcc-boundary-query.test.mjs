import { expect, jest, test } from "@jest/globals";
import { createArtccBoundaryQuery } from "../../src/backend/artcc-boundary-query.mjs";

test("returns full ordered ARTCC boundary points for bands with nearby vertices", () => {
  const nearby = {
    all: jest.fn(() => [
      {
        locationId: "ZBW",
        name: "BOSTON",
        altitude: "LOW",
        type: "ARTCC",
        sequence: 10,
        latitude: 43,
        longitude: -70,
      },
    ]),
  };
  const full = { all: jest.fn(() => [{ sequence: 10, latitude: 43, longitude: -70 }]) };
  const database = { prepare: jest.fn((sql) => (sql.includes("ORDER BY") ? full : nearby)) };
  const query = createArtccBoundaryQuery(database);
  const result = query({ latitude: 43, longitude: -70 }, 0, 20);
  expect(result[0]).toMatchObject({ id: "ZBW:LOW:ARTCC", locationId: "ZBW", altitude: "LOW" });
  expect(full.all).toHaveBeenCalledWith("ZBW", "LOW", "ARTCC");
});

test("returns boundaries only when a point falls inside the requested distance band", () => {
  const nearby = {
    all: jest.fn(() => [
      {
        locationId: "ZBW",
        name: "BOSTON",
        altitude: "LOW",
        type: "ARTCC",
        latitude: 43.2,
        longitude: -70,
      },
      {
        locationId: "ZBW",
        name: "BOSTON",
        altitude: "HIGH",
        type: "ARTCC",
        latitude: 43.05,
        longitude: -70,
      },
      {
        locationId: "ZNY",
        name: "NEW YORK",
        altitude: "LOW",
        type: "ARTCC",
        latitude: 44,
        longitude: -70,
      },
    ]),
  };
  const full = { all: jest.fn(() => [{ sequence: "10", latitude: 43.2, longitude: -70 }]) };
  const database = { prepare: jest.fn((sql) => (sql.includes("ORDER BY") ? full : nearby)) };
  const results = createArtccBoundaryQuery(database)({ latitude: 43, longitude: -70 }, 5, 20);
  expect(results.map((item) => item.id)).toEqual(["ZBW:LOW:ARTCC"]);
  expect(full.all).toHaveBeenCalledTimes(1);
});
