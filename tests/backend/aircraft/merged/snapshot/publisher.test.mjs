import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftSnapshotPublisher } from "../../../../../src/backend/aircraft/merged/snapshot/publisher.mjs";

test("starts one periodic snapshot task and stops it once", () => {
  const publish = jest.fn();
  const setIntervalFn = jest.fn(() => 42);
  const clearIntervalFn = jest.fn();
  const publisher = createMergedAircraftSnapshotPublisher(publish, setIntervalFn, clearIntervalFn);
  publisher.start();
  publisher.start();
  expect(setIntervalFn).toHaveBeenCalledWith(publish, 1000);
  expect(setIntervalFn).toHaveBeenCalledTimes(1);
  publisher.stop();
  publisher.stop();
  expect(clearIntervalFn).toHaveBeenCalledWith(42);
  expect(clearIntervalFn).toHaveBeenCalledTimes(1);
});

test("uses the native timer functions by default", () => {
  jest.useFakeTimers();
  try {
    const publisher = createMergedAircraftSnapshotPublisher(jest.fn());
    publisher.start();
    expect(jest.getTimerCount()).toBe(1);
    publisher.stop();
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
});
