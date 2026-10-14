import { expect, jest, test } from "@jest/globals";
import { createProcedureQuery } from "../../src/backend/procedure-query.mjs";
import { SID_QUERY, STAR_QUERY } from "../../src/backend/procedure-query-rules.mjs";

const first = {
  type: "SID",
  name: "TEST",
  code: "TEST1",
  airportId: "BOS",
  airportLatitude: 43,
  airportLongitude: -70,
  portionType: "BODY",
  routeName: "ENTRY-EXIT",
  bodySequence: "1",
  transitionCode: "",
  runwayAssociation: "",
  sequence: 10,
  fix: "ENTRY",
  fixType: "WP",
  latitude: 43,
  longitude: -70,
};
const last = { ...first, sequence: 20, fix: "EXIT", latitude: 44 };

test("returns complete paths that enter the requested distance band", () => {
  const sid = { all: jest.fn(() => [first, last]) };
  const star = { all: jest.fn(() => []) };
  const query = createProcedureQuery({ prepare: (sql) => (sql === SID_QUERY ? sid : star) });
  const result = query({ latitude: 43, longitude: -70 }, 0, 20);
  expect(result).toHaveLength(1);
  expect(result[0].points.map((point) => point.fix)).toEqual(["ENTRY", "EXIT"]);
  expect(result[0].points[1].rangeNm).toBeGreaterThan(20);
  expect(query({ latitude: 43, longitude: -70 }, 20, 30)).toEqual([]);
  expect(sid.all).toHaveBeenCalledTimes(1);
  expect(star.all).toHaveBeenCalledTimes(1);
});

test("includes home and outer fixes in their distance bands", () => {
  const near = {
    ...first,
    airportLatitude: 43.05,
    sequence: 15,
    fix: "NEAR",
    latitude: 43.05,
  };
  const query = createProcedureQuery({
    prepare: (sql) => (sql === SID_QUERY ? { all: () => [first, near, last] } : { all: () => [] }),
  });
  expect(query({ latitude: 43, longitude: -70 }, 0, 1)).toHaveLength(1);
  expect(query({ latitude: 42.95, longitude: -70 }, 1, 10)).toHaveLength(1);
});

test("returns no paths when records lack valid point coordinates", () => {
  const query = createProcedureQuery({
    prepare: (sql) => ({ all: () => (sql === STAR_QUERY ? [] : [{ ...first, latitude: NaN }]) }),
  });
  expect(query({ latitude: 43, longitude: -70 }, 0, 20)).toEqual([]);
});
