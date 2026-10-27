import { expect, test } from "@jest/globals";
import { selectProcedurePaths } from "../../../src/backend/procedure/select-paths.mjs";

const location = { latitude: 43, longitude: -70 };
const path = {
  id: "route",
  airportLatitude: 43.1,
  airportLongitude: -70,
  points: [
    { fix: "near", latitude: 43.2, longitude: -70 },
    { fix: "far", latitude: 48, longitude: -70 },
  ],
};

test("selects paths by airport range and clips their final point at 300 NM", () => {
  const [result] = selectProcedurePaths([path], location, 0, 20);
  expect(result.id).toBe("route");
  expect(result.airportRangeNm).toBeGreaterThan(0);
  expect(result.airportRangeNm).toBeLessThan(20);
  expect(result.points).toHaveLength(2);
  expect(result.points[0].fix).toBe("near");
  expect(result.points[0].rangeNm).toBeGreaterThan(result.airportRangeNm);
  expect(result.points[1].rangeNm).toBe(300);
  expect(result.points[1].latitude).toBeLessThan(48);
});

test("keeps an in-range path intact and excludes paths outside the band", () => {
  const airportRange = selectProcedurePaths([path], location, 0, 20)[0].airportRangeNm;
  expect(selectProcedurePaths([path], location, airportRange, 20)).toEqual([]);
  expect(selectProcedurePaths([path], location, 0, airportRange - 0.01)).toEqual([]);
  const local = { ...path, points: [{ latitude: 43, longitude: -70 }] };
  expect(selectProcedurePaths([local], location, 0, 20)[0].points).toHaveLength(1);
  const beyond = { ...path, points: [{ latitude: 48, longitude: -70 }] };
  expect(selectProcedurePaths([beyond], location, 0, 20)[0].points).toEqual([]);
});
