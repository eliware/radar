import { afterEach, expect, jest, test } from "@jest/globals";
import { createRadarReferenceRequestScheduler } from "../../../../src/frontend/radar/reference/request-scheduler.mjs";

async function flush() {
  for (let index = 0; index < 8; index += 1) await Promise.resolve();
}

afterEach(() => jest.useRealTimers());

test("fetches the initial band immediately and queues later bands", async () => {
  jest.useFakeTimers();
  const resolvers = [];
  const fetchRange = jest.fn(
    (minimum, maximum) => new Promise((resolve) => resolvers.push({ minimum, maximum, resolve })),
  );
  const onLoaded = jest.fn();
  const scheduler = createRadarReferenceRequestScheduler(fetchRange, onLoaded);
  scheduler.request(50);
  scheduler.request(75);
  expect(fetchRange).toHaveBeenCalledWith(0, 50);
  resolvers[0].resolve(["first"]);
  await flush();
  expect(onLoaded).toHaveBeenCalledWith(["first"]);
  await jest.advanceTimersByTimeAsync(180);
  expect(fetchRange).toHaveBeenLastCalledWith(50, 75);
  expect(scheduler.loadedThrough).toBe(50);
  resolvers[1].resolve(["second"]);
  await flush();
  expect(scheduler.loadedThrough).toBe(75);
});

test("retries a failed batch with backoff and reports later success", async () => {
  jest.useFakeTimers();
  const fetchRange = jest
    .fn()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(["loaded"]);
  const onLoaded = jest.fn();
  const scheduler = createRadarReferenceRequestScheduler(fetchRange, onLoaded);
  scheduler.request(25);
  await flush();
  expect(fetchRange).toHaveBeenCalledTimes(1);
  await jest.advanceTimersByTimeAsync(180);
  await flush();
  expect(fetchRange).toHaveBeenCalledTimes(2);
  expect(onLoaded).toHaveBeenCalledWith(["loaded"]);
  expect(scheduler.loadedThrough).toBe(25);
});
