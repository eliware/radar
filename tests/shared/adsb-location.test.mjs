import { expect, test } from "@jest/globals";
import { parseAdsbLocation } from "../../src/shared/adsb-location.mjs";

test("parses decimal latitude and longitude", () => {
  expect(parseAdsbLocation("43.857616503999, -70.41360202151915")).toEqual({
    latitude: 43.857616503999,
    longitude: -70.41360202151915,
  });
  expect(parseAdsbLocation(undefined)).toBeNull();
  expect(parseAdsbLocation("   ")).toBeNull();
});

test("rejects invalid coordinate text and ranges", () => {
  for (const value of ["1", "1,", "north, west", "91, 0", "0, -181"]) {
    expect(() => parseAdsbLocation(value)).toThrow("MY_LOCATION");
  }
});
