import { expect, test } from "@jest/globals";
import { groupRunwayEnds } from "../../../../src/backend/airport/runway/groups.mjs";

const end = (airportId, runwayId, overrides = {}) => ({
  airportId,
  runwayId,
  latitude: 43,
  longitude: -70,
  alignmentDegrees: 90,
  ...overrides,
});

test("groups only valid pairs of runway ends by airport", () => {
  const first = end("PWM", "09/27");
  const second = end("PWM", "09/27", { alignmentDegrees: 270 });
  const ends = [
    first,
    second,
    end("PWM", "single"),
    end("PWM", "triple"),
    end("PWM", "triple"),
    end("PWM", "triple"),
    end("BAD", "invalid", { latitude: Number.NaN }),
    end("BAD", "invalid", { alignmentDegrees: Number.NaN }),
  ];

  expect(groupRunwayEnds(ends)).toEqual(new Map([["PWM", [[first, second]]]]));
});

test("returns an empty map when there are no valid runway ends", () => {
  expect(groupRunwayEnds([])).toEqual(new Map());
});
