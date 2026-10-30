import { expect, test } from "@jest/globals";
import { parseAdsbLolPollInterval } from "../../../src/backend/config/adsblol-poll-interval.mjs";

test("accepts configured ADSB.lol poll intervals within the supported range", () => {
  expect(parseAdsbLolPollInterval("1000")).toBe(1000);
  expect(parseAdsbLolPollInterval("300000")).toBe(300000);
  expect(parseAdsbLolPollInterval(undefined)).toBe(6000);
});

test.each(["", "invalid", "1000.5", "999", "300001"])(
  "rejects unsupported ADSB.lol poll interval %s",
  (value) => {
    expect(() => parseAdsbLolPollInterval(value)).toThrow(
      "ADSBLOL_POLL_INTERVAL_MS must be an integer from 1000 through 300000",
    );
  },
);
