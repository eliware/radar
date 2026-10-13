import { expect, test } from "@jest/globals";
import { buildFlightStripData } from "../../src/frontend/flight-strip-data.mjs";

const fullAircraft = {
  icao: "ABC123",
  callsign: "RADAR1",
  altitudeFeet: 12500,
  groundSpeedKnots: 200,
  trackDegrees: 9,
  verticalRateFeetPerMinute: -640,
  squawk: "1200",
  aircraftTypeCode: "B738",
  distanceNauticalMiles: 4.2,
  bearingDegrees: 7,
  origin: "KPWM",
  destination: "KBOS",
};

test("sorts aircraft and formats the nine aligned fields", () => {
  const far = { ...fullAircraft, icao: "FAR123", distanceNauticalMiles: 40 };
  const result = buildFlightStripData([far, fullAircraft], 3000);
  expect(result.count).toBe(2);
  expect(result.aircraft.map((item) => item.icao)).toEqual(["ABC123", "FAR123"]);
  expect(result.aircraft[0].groups[0]).toEqual([
    "RADAR1",
    "125-06",
    "B738",
    "009°200",
    "1200",
    "",
    "007°4",
    "KPWM",
    "KBOS",
  ]);
});

test("uses two or three aligned data rows as width shrinks", () => {
  expect(buildFlightStripData([], 100).count).toBe(0);
  const two = buildFlightStripData([fullAircraft], 500);
  const three = buildFlightStripData([fullAircraft], 250);
  expect(two.weights).toHaveLength(2);
  expect(three.weights).toHaveLength(3);
  expect(two.weights.every((row) => row.length === 5)).toBe(true);
  expect(three.weights.every((row) => row.length === 3)).toBe(true);
});

test("shows optional type, range, origin, and destination values", () => {
  const row = buildFlightStripData([{ icao: "A1B2C3" }], 1000).aircraft[0];
  expect(row.groups.flat()).toContain("A1B2C3");
  expect(row.groups.flat()).toContain("-");
  expect(row.labels[0]).toEqual([
    "CALLSIGN",
    "ALTITUDE / VS",
    "TYPE",
    "HEADING / SPEED",
    "SQUAWK",
    "",
    "BEARING / RANGE",
    "ORIGIN",
    "DESTINATION",
  ]);
  const missingIdentity = buildFlightStripData([{ distanceNauticalMiles: 2 }, {}], 1000);
  expect(buildFlightStripData([{}, { distanceNauticalMiles: 2 }], 1000).count).toBe(2);
  expect(missingIdentity.aircraft[0].icao).toBe("");
  expect(missingIdentity.aircraft[0].groups[0][0]).toBe("-");
});

test("keeps the combined fields readable when one value is missing", () => {
  const row = buildFlightStripData(
    [{ trackDegrees: 359 }, { groundSpeedKnots: 457 }],
    3000,
  ).aircraft;
  expect(row[0].groups[0][3]).toBe("359°-");
  expect(row[1].groups[0][3]).toBe("-457");
});
