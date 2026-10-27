import { expect, jest, test } from "@jest/globals";
import { createAirwayQuery } from "../../../src/backend/airway/query.mjs";
import { AIRWAY_QUERY } from "../../../src/backend/airway/query-rules.mjs";

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
