import { expect, test } from "@jest/globals";
import { default as groupRunwayEnds } from "../../../../src/backend/airport/runway/groups.mjs";

const end = (airportId, runwayId, overrides = {}) => ({
  airportId,
  runwayId,
  latitude: 43,
  longitude: -70,
  alignmentDegrees: 90,
  ...overrides,
});

test("groups valid runway ends and preserves a single valid end", () => {
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
  ];

  expect(groupRunwayEnds(ends)).toEqual(new Map([["PWM", [[first, second], [ends[2]]]]]));
});

test("returns an empty map when there are no valid runway ends", () => {
  expect(groupRunwayEnds([])).toEqual(new Map());
});
