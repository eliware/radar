import { expect, test } from "@jest/globals";
import { buildFlightStripData } from "../../../../src/frontend/flight/strip/data.mjs";

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
  lastSeen: 1000,
};

test("formats visible fields without a one-row spacer", () => {
  const result = buildFlightStripData([fullAircraft], 3000);
  expect(result.count).toBe(1);
  expect(result.rowCount).toBeGreaterThan(0);
  expect(result.aircraft[0].lastSeen).toBe(1000);
});

test("preserves the remote-only source flag for strip rendering", () => {
  const rows = buildFlightStripData(
    [
      { ...fullAircraft, icao: "LOCAL" },
      { ...fullAircraft, icao: "REMOTE", remoteOnly: true },
    ],
    3000,
  ).aircraft;
  expect(rows.find((item) => item.icao === "LOCAL").remoteOnly).toBe(false);
  expect(rows.find((item) => item.icao === "REMOTE").remoteOnly).toBe(true);
});

test("defaults missing aircraft identifiers", () => {
  const result = buildFlightStripData([{ lastSeen: 2 }], 1000);
  expect(result.aircraft[0].icao).toBe("");
});
