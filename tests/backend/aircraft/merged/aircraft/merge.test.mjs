import { expect, test } from "@jest/globals";
import {
  compareAircraftDistance,
  mergeAircraftRecord,
} from "../../../../../src/backend/aircraft/merged/aircraft/merge.mjs";

test("merges the remote-only record and sorts missing distances last", () => {
  expect(mergeAircraftRecord({ remote: { icao: "ABC" } }, 0, 8000)).toEqual({
    icao: "ABC",
    remoteOnly: true,
  });
  expect(compareAircraftDistance({ distanceNauticalMiles: 2 }, {})).toBeLessThan(0);
});
