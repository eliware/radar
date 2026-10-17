import { expect, jest, test } from "@jest/globals";
import { createAirwayQuery } from "../../src/backend/airway-query.mjs";
import { AIRWAY_QUERY } from "../../src/backend/airway-query-rules.mjs";

const home = { latitude: 0, longitude: 0 };
const point = (name, longitude, nextFix = "") => ({
  name: "Q12",
  location: "C",
  regulatory: "Y",
  sequence: longitude < 0 ? 10 : 20,
  fix: name,
  nextFix,
  latitude: 0,
  longitude,
});

test("returns named airway paths that cross the requested range band", () => {
  const statement = { all: jest.fn(() => [point("WEST", -0.5, "EAST"), point("EAST", 0.5)]) };
  const query = createAirwayQuery({
    prepare: (sql) => (expect(sql).toBe(AIRWAY_QUERY), statement),
  });
  const result = query(home, 10, 20);
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({ id: "Q12:C:Y:0", name: "Q12", type: "Q" });
  expect(result[0].points.map(({ fix }) => fix)).toEqual(["WEST", "EAST"]);
  expect(result[0].points[0].x).toBeCloseTo(-30);
  query(home, 0, 20);
  expect(statement.all).toHaveBeenCalledTimes(1);
});

test("omits out-of-range and unresolved paths but retains a nearby single fix", () => {
  const rows = [
    { ...point("FAR", 10), latitude: 5 },
    { ...point("BAD", 0), latitude: Number.NaN },
    { ...point("BAD-LON", 0, ""), longitude: Number.NaN },
    { ...point("NEAR", 0.1), name: "V1" },
  ];
  const query = createAirwayQuery({ prepare: () => ({ all: () => rows }) });
  expect(query(home, 0, 20).map((route) => route.name)).toEqual(["V1"]);
});

test("separates discontinuous fixes into distinct airway paths", () => {
  const rows = [point("A", 0.1, "B"), point("C", 0.2, "")];
  const query = createAirwayQuery({ prepare: () => ({ all: () => rows }) });
  const result = query(home, 0, 20);
  expect(result).toHaveLength(2);
  expect(result.map((route) => route.points[0].fix)).toEqual(["A", "C"]);
});

test("handles consecutive fixes at the same coordinate", () => {
  const rows = [point("SAME", 0, "NEXT"), point("NEXT", 0)];
  const query = createAirwayQuery({ prepare: () => ({ all: () => rows }) });
  expect(query(home, 0, 10)).toHaveLength(1);
});
