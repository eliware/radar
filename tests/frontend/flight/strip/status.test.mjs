import { expect, test } from "@jest/globals";
import { getFlightStripStatus } from "../../../../src/frontend/flight/strip/status.mjs";

test("selects age opacity and remote or emergency status classes", () => {
  expect(getFlightStripStatus({ remoteOnly: true, lastSeen: 1_000 }, 1_000)).toEqual({
    opacity: 1,
    classNames: "remote-only",
  });
  expect(getFlightStripStatus({ squawk: "7700", lastSeen: 1 }, 121_000)).toEqual({
    opacity: 0.25,
    classNames: "emergency",
  });
});

test("selects both near-home flash classes and suppresses them for other statuses", () => {
  const item = { nearHomePass: true, lastSeen: 500 };
  expect(getFlightStripStatus(item, 500).classNames).toBe("near-home-pass flash-white");
  expect(getFlightStripStatus(item, 0).classNames).toBe("near-home-pass flash-green");
  expect(getFlightStripStatus({ ...item, remoteOnly: true }, 500).classNames).toBe("remote-only");
  expect(getFlightStripStatus({ ...item, squawk: "7700" }, 500).classNames).toBe("emergency");
});

test("uses the current time when no timestamp is supplied", () => {
  expect(getFlightStripStatus({}).opacity).toBe(1);
});
