import { expect, jest, test } from "@jest/globals";
import { createWebSocketRetry } from "../../../src/frontend/websocket/retry.mjs";

test("schedules exponential delays with a thirty-second cap", () => {
  const timers = [];
  const onRetry = jest.fn();
  const retry = createWebSocketRetry({
    setTimer: (callback, delay) => (timers.push({ callback, delay }), timers.length),
    clearTimer: jest.fn(),
    onRetry,
  });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    retry.schedule();
    timers.at(-1).callback();
  }
  expect(timers.map(({ delay }) => delay)).toEqual([
    1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000,
  ]);
  expect(onRetry).toHaveBeenCalledTimes(8);
});

test("ignores duplicate schedules, resets delay, and cancels pending retries", () => {
  const timers = [];
  const clearTimer = jest.fn();
  const onRetry = jest.fn();
  const retry = createWebSocketRetry({
    setTimer: (callback, delay) => (timers.push({ callback, delay }), timers.length),
    clearTimer,
    onRetry,
  });
  retry.schedule();
  retry.schedule();
  expect(retry.pending).toBe(true);
  expect(timers).toHaveLength(1);
  timers[0].callback();
  retry.schedule();
  expect(timers[1].delay).toBe(2000);
  retry.reset();
  timers[1].callback();
  retry.schedule();
  expect(timers[2].delay).toBe(1000);
  retry.cancel();
  expect(clearTimer).toHaveBeenCalledWith(3);
  expect(retry.pending).toBe(false);
  timers[2].callback();
  expect(onRetry).toHaveBeenCalledTimes(2);
});
