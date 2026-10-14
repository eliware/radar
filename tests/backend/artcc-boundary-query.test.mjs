import { expect, jest, test } from "@jest/globals";
import { createArtccBoundaryQuery } from "../../src/backend/artcc-boundary-query.mjs";

const home = { latitude: 43, longitude: -70 };
const row = (sequence, latitude, longitude, locationId = "ZBW", altitude = "LOW") => ({
  sequence,
  latitude,
  longitude,
  locationId,
  name: "BOSTON",
  altitude,
  type: "ARTCC",
});

function queryWith(rows) {
  const statement = { all: jest.fn(() => rows) };
  const database = { prepare: jest.fn(() => statement) };
  return { query: createArtccBoundaryQuery(database), statement };
}

test("returns ordered full boundaries when a segment crosses the range", () => {
  const points = [row(1, 43, -71), row(2, 43, -69)];
  const { query, statement } = queryWith(points);
  const results = query(home, 0, 20);
  expect(results).toEqual([
    {
      id: "ZBW:LOW:ARTCC",
      locationId: "ZBW",
      name: "BOSTON",
      altitude: "LOW",
      type: "ARTCC",
      points: points.map(({ sequence, latitude, longitude }) => ({
        sequence,
        latitude,
        longitude,
      })),
    },
  ]);
  expect(statement.all).toHaveBeenCalledTimes(1);
});

test("selects paths that cross the requested outer band only", () => {
  const points = [row(1, 43, -70.5), row(2, 43, -69.5)];
  const { query } = queryWith(points);
  expect(query(home, 15, 30)).toHaveLength(1);
  expect(query(home, 30, 40)).toEqual([]);
});

test("filters isolated points by range and skips empty paths", () => {
  const points = [row(1, 43, -70.2), row(1, 43, -69.5, "ZNY", "HIGH")];
  const { query } = queryWith(points);
  expect(query(home, 0, 20).map((item) => item.locationId)).toEqual(["ZBW"]);
  expect(query(home, 20, 30).map((item) => item.locationId)).toEqual(["ZNY"]);
  expect(queryWith([]).query(home, 0, 20)).toEqual([]);
});

test("handles repeated adjacent boundary vertices", () => {
  const { query } = queryWith([row(1, 43, -70), row(2, 43, -70)]);
  expect(query(home, 0, 20)).toHaveLength(1);
});
