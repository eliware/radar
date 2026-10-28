import { expect, jest, test } from "@jest/globals";
import { scheduleFlightStripRefresh } from "../../../../src/frontend/flight/strip/scheduling.mjs";

test("schedules refreshes on resize and at the regular interval", () => {
  const windowRef = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn(() => 19),
    clearInterval: jest.fn(),
  };
  const refresh = jest.fn();
  const stop = scheduleFlightStripRefresh(windowRef, refresh);

  expect(windowRef.addEventListener).toHaveBeenCalledWith("resize", refresh);
  expect(windowRef.setInterval).toHaveBeenCalledWith(refresh, 500);
  stop();
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", refresh);
  expect(windowRef.clearInterval).toHaveBeenCalledWith(19);
});

test("supports a missing window", () => {
  expect(() => scheduleFlightStripRefresh(undefined, jest.fn())()).not.toThrow();
});
