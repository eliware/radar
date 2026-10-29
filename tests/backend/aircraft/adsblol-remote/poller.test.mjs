import { expect, jest, test } from "@jest/globals";
import { createAdsbLolPoller } from "../../../../src/backend/aircraft/adsblol-remote/poller.mjs";

function setup(overrides = {}) {
  const timers = new Map();
  let id = 0;
  let connected = true;
  const setTimeoutFn = jest.fn((callback, delay) => {
    const key = ++id;
    timers.set(key, { delay, callback: async () => (timers.delete(key), await callback()) });
    return key;
  });
  const clearTimeoutFn = jest.fn((key) => timers.delete(key));
  const poll = jest.fn(async () => {});
  const onError = jest.fn();
  const poller = createAdsbLolPoller({
    poll,
    hasClients: () => connected,
    setTimeoutFn,
    clearTimeoutFn,
    onError,
    ...overrides,
  });
  return {
    poller,
    timers,
    poll: overrides.poll ?? poll,
    onError,
    setTimeoutFn,
    clearTimeoutFn,
    disconnect: () => (connected = false),
  };
}

async function tick(state) {
  const timer = state.timers.values().next().value;
  expect(timer).toBeDefined();
  await timer.callback();
}

test("schedules another poll after failure and continues after a success", async () => {
  const poll = jest.fn().mockRejectedValueOnce(new Error("429")).mockResolvedValueOnce(undefined);
  const state = setup({ poll });
  state.poller.start();
  await tick(state);
  expect(state.onError).toHaveBeenCalledWith(expect.objectContaining({ message: "429" }));
  await tick(state);
  expect(poll).toHaveBeenCalledTimes(2);
  expect(state.timers.size).toBe(1);
  state.poller.close();
});

test("passes a validity check to the active polling request", async () => {
  let isCurrent;
  const state = setup({ poll: jest.fn((check) => (isCurrent = check)) });
  state.poller.start();
  await tick(state);
  expect(isCurrent()).toBe(true);
  state.poller.stop();
  expect(isCurrent()).toBe(false);
  state.poller.close();
});

test("logs failed requests and cancels pending retries when stopped", async () => {
  const state = setup({ poll: jest.fn().mockRejectedValue(new Error("network")) });
  state.poller.start();
  await tick(state);
  expect(state.onError).toHaveBeenCalledWith(expect.objectContaining({ message: "network" }));
  state.poller.stop();
  expect(state.clearTimeoutFn).toHaveBeenCalledTimes(1);
  expect(state.timers.size).toBe(0);
  state.disconnect();
  state.poller.close();
});

test("does not schedule work without clients or after close", () => {
  const state = setup();
  state.disconnect();
  state.poller.start();
  expect(state.timers.size).toBe(0);
  state.poller.close();
  state.poller.start();
  expect(state.timers.size).toBe(0);
});

test("ignores duplicate starts and stale timer callbacks", async () => {
  const state = setup();
  state.poller.start();
  const scheduled = state.timers.values().next().value;
  state.poller.start();
  expect(state.setTimeoutFn).toHaveBeenCalledTimes(1);
  state.disconnect();
  state.poller.stop();
  await scheduled.callback();
  expect(state.poll).not.toHaveBeenCalled();
});

test("restarts at the normal interval after an old request finishes", async () => {
  let resolve;
  const state = setup({ poll: () => new Promise((done) => (resolve = done)) });
  state.poller.start();
  const pending = tick(state);
  state.poller.stop();
  state.poller.start();
  await tick(state);
  resolve();
  await pending;
  expect([...state.timers.values()][0].delay).toBe(6000);
  state.poller.close();
});

test("uses default timers and delays without clients", () => {
  const poller = createAdsbLolPoller({ poll: jest.fn(), hasClients: () => false });
  poller.start();
  poller.close();
});

test("calls the default error handler", async () => {
  let fire;
  let id = 0;
  const poller = createAdsbLolPoller({
    poll: jest.fn().mockRejectedValue(new Error("default error callback")),
    hasClients: () => true,
    setTimeoutFn: (callback) => ((fire = callback), ++id),
    clearTimeoutFn: jest.fn(),
  });
  poller.start();
  await fire();
  poller.close();
});

test("discards failures from a request invalidated by disconnect", async () => {
  let reject;
  const state = setup({ poll: () => new Promise((_resolve, fail) => (reject = fail)) });
  state.poller.start();
  const pending = tick(state);
  state.disconnect();
  state.poller.stop();
  reject(new Error("late"));
  await pending;
  expect(state.onError).not.toHaveBeenCalled();
  expect(state.timers.size).toBe(0);
});
