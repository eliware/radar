import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRemotePolling } from "../../../../src/backend/aircraft/adsblol-remote/polling.mjs";

function setup(location = { latitude: 43.8, longitude: -70.4 }, requestOverride) {
  const timers = new Map();
  let id = 0;
  const aircraft = { update: jest.fn() };
  const publish = jest.fn();
  const request =
    requestOverride ??
    jest.fn(async () => ({
      ok: true,
      json: async () => ({ aircraft: [{ hex: "abc123" }] }),
    }));
  const poller = createAdsbLolRemotePolling({
    location,
    request,
    pollingPolicy: () => ({ radiusNm: 42 }),
    aircraft,
    publish,
    hasClients: () => true,
    setTimeoutFn: (callback, delay) => (timers.set(++id, { callback, delay }), id),
    clearTimeoutFn: (timerId) => timers.delete(timerId),
    onError: jest.fn(),
    intervalMs: 6000,
  });
  return { poller, timers, request, aircraft, publish };
}

test("polls the configured circle and publishes current aircraft records", async () => {
  const state = setup();
  state.poller.start();
  const { callback } = state.timers.values().next().value;
  await callback();
  expect(state.request).toHaveBeenCalledWith(
    expect.stringContaining("circle=43.8,-70.4,42"),
    expect.any(Object),
  );
  expect(state.aircraft.update).toHaveBeenCalledWith({ hex: "abc123" });
  expect(state.publish).toHaveBeenCalledTimes(1);
  state.poller.close();
});

test("skips requests when the location is invalid", async () => {
  const state = setup(null);
  state.poller.start();
  const { callback } = state.timers.values().next().value;
  await callback();
  expect(state.request).not.toHaveBeenCalled();
  expect(state.publish).not.toHaveBeenCalled();
  state.poller.close();
});

test("discards response records after the polling request is invalidated", async () => {
  let resolveResponse;
  const request = jest.fn(
    () =>
      new Promise((resolve) => {
        resolveResponse = resolve;
      }),
  );
  const state = setup(undefined, request);
  state.poller.start();
  const { callback } = state.timers.values().next().value;
  const pending = callback();
  state.poller.stop();
  resolveResponse({ ok: true, json: async () => ({ aircraft: [{ hex: "abc123" }] }) });
  await pending;
  expect(state.aircraft.update).not.toHaveBeenCalled();
  expect(state.publish).not.toHaveBeenCalled();
  state.poller.close();
});
