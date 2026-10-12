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
  latitude: 43.5,
  longitude: -70.4,
  distanceNauticalMiles: 4.2,
  bearingDegrees: 7,
  lastSeen: 1000,
};

test("sorts aircraft by distance and formats every full field", () => {
  const far = { ...fullAircraft, icao: "FAR123", distanceNauticalMiles: 40 };
  const result = buildFlightStripData([far, fullAircraft], 3000, 2000);
  expect(result.count).toBe(2);
  expect(result.headers[0]).toContain("CALLSIGN");
  expect(result.aircraft.map((item) => item.icao)).toEqual(["ABC123", "FAR123"]);
  expect(result.aircraft[0].groups[0]).toEqual([
    "RADAR1",
    "ABC123",
    "12,500 ft",
    "200 kt",
    "009°",
    "-640 fpm",
    "1200",
    "43.5000, -70.4000",
    "4.2 nm",
    "007°",
    "1s",
  ]);
});

test("uses short headers, then two or three data rows as width shrinks", () => {
  expect(buildFlightStripData([], 700, 0).headers[0]).toContain("ALT");
  expect(buildFlightStripData([], 400, 0).headers).toHaveLength(2);
  expect(buildFlightStripData([], 300, 0).headers).toHaveLength(3);
});

test("shows dashes for missing values and a zero age without a timestamp", () => {
  const result = buildFlightStripData([{ icao: "NOINFO" }], 3000, 5000);
  expect(result.aircraft[0].groups[0]).toEqual([
    "-",
    "NOINFO",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "0s",
  ]);
  expect(buildFlightStripData([{}], 3000, 5000).aircraft[0].icao).toBe("");
});
