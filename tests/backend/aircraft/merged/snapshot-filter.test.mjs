import { expect, test } from "@jest/globals";
import { filterAircraftSnapshot } from "../../../../src/backend/aircraft/merged/snapshot-filter.mjs";

const aircraft = [
  { icao: "LOCAL", distanceNauticalMiles: 4, remoteOnly: false },
  { icao: "REMOTE", distanceNauticalMiles: 4, remoteOnly: true },
  { icao: "FAR", distanceNauticalMiles: 12, remoteOnly: false },
  { icao: "UNKNOWN", remoteOnly: true },
];

test("filters snapshots by radius and local-only preference", () => {
  expect(filterAircraftSnapshot(aircraft, 4, true).map(({ icao }) => icao)).toEqual(["LOCAL"]);
  expect(filterAircraftSnapshot(aircraft, 4, false).map(({ icao }) => icao)).toEqual([
    "LOCAL",
    "REMOTE",
  ]);
});
