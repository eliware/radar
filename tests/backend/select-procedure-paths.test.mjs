import { expect, test } from "@jest/globals";
import { selectProcedurePaths } from "../../src/backend/select-procedure-paths.mjs";

const home = { latitude: 43, longitude: -70 };
const path = {
  airportLatitude: 43.1,
  airportLongitude: -70,
  points: [{ latitude: 43.2, longitude: -70, fix: "TEST" }],
};

test("selects airport paths in the requested distance band", () => {
  const [result] = selectProcedurePaths([path], home, 0, 10);
  expect(result.airportRangeNm).toBeGreaterThan(0);
  expect(result.airportRangeNm).toBeLessThan(10);
  expect(result.points[0]).toMatchObject({ fix: "TEST" });
  expect(result.points[0].rangeNm).toBeGreaterThan(result.airportRangeNm);
});

test("excludes paths on the inner boundary and beyond the outer boundary", () => {
  const airportRange = selectProcedurePaths([path], home, 0, 20)[0].airportRangeNm;
  expect(selectProcedurePaths([path], home, airportRange, 20)).toEqual([]);
  expect(selectProcedurePaths([path], home, 0, airportRange - 0.01)).toEqual([]);
});
