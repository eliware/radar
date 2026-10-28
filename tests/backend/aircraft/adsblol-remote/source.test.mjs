import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRemoteSource } from "../../../../src/backend/aircraft/adsblol-remote/source.mjs";

function setup(overrides = {}) {
  const timers = new Map();
  let nextId = 0;
  const setTimeoutFn = jest.fn((callback, delay) => {
    const id = ++nextId;
    timers.set(id, { delay, callback: async () => (timers.delete(id), await callback()) });
    return id;
  });
  const clearTimeoutFn = jest.fn((id) => timers.delete(id));
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft: [] }) }));
  const options = {
    location: { latitude: 43.8, longitude: -70.4 },
    defaultRangeNm: 25,
    request,
    setTimeoutFn,
    clearTimeoutFn,
    ...overrides,
  };
  return {
    timers,
    request: options.request,
    setTimeoutFn,
    clearTimeoutFn,
    source: createAdsbLolRemoteSource(options),
  };
}

async function tick(state) {
  const timer = state.timers.values().next().value;
  expect(timer).toBeDefined();
  await timer.callback();
}

test("polls using the connected client's radius and publishes aircraft updates", async () => {
  const state = setup({
    request: jest.fn(async () => ({
      ok: true,
      json: async () => ({
        aircraft: [{ hex: "abc123", lat: 43.9, lon: -70.3, seen: 0.4, seen_pos: 0.8, t: "E75L" }],
      }),
    })),
  });
  const subscriber = jest.fn();
  state.source.subscribe(subscriber);
  state.source.connectClient("phone");
  state.source.setClientRadius("phone", 42.1);
  expect([...state.timers.values()][0].delay).toBe(6000);
  await tick(state);
  expect(state.request.mock.calls[0][0]).toContain("circle=43.8,-70.4,43");
  expect(state.request.mock.calls[0][1].headers["user-agent"]).toContain("radar@eliware.org");
  expect(state.source.list()).toMatchObject([{ icao: "ABC123", aircraftTypeCode: "E75L" }]);
  expect(subscriber).toHaveBeenCalledTimes(1);
  state.source.disconnectClient("phone");
  expect(state.source.list()).toEqual([]);
});

test("backs off failures exponentially, caps at five minutes, then resets after success", async () => {
  const onError = jest.fn();
  const request = jest.fn(async () => ({ ok: false, status: 429 }));
  const state = setup({ request, onError });
  state.source.connectClient("browser");
  expect([...state.timers.values()][0].delay).toBe(6000);
  const expected = [12000, 24000, 48000, 96000, 192000, 300000, 300000];
  for (const delay of expected) {
    await tick(state);
    expect([...state.timers.values()][0].delay).toBe(delay);
  }
  expect(onError).toHaveBeenCalledTimes(expected.length);
  request.mockImplementationOnce(async () => ({ ok: true, json: async () => ({ aircraft: [] }) }));
  await tick(state);
  expect([...state.timers.values()][0].delay).toBe(6000);
  state.source.disconnectClient("browser");
});

test("expires old positions and rejects invalid remote aircraft", async () => {
  let now = 100_000;
  const state = setup({
    clock: () => now,
    request: jest.fn(async () => ({
      ok: true,
      json: async () => ({
        aircraft: [
          { hex: "abc123", lat: 43.9, lon: -70.3, seen_pos: 0 },
          { hex: "bad", lat: "43", lon: -70.3, seen_pos: 0 },
        ],
      }),
    })),
  });
  state.source.connectClient("browser");
  await tick(state);
  expect(state.source.list()).toHaveLength(1);
  now += 120_001;
  expect(state.source.list()).toEqual([]);
  state.source.close();
});

test("handles invalid viewport reports, missing location, and subscription cleanup", async () => {
  const state = setup({ location: null });
  const subscriber = jest.fn();
  const unsubscribe = state.source.subscribe(subscriber);
  unsubscribe();
  unsubscribe();
  state.source.setClientRadius("missing", 90);
  state.source.connectClient("browser");
  state.source.setClientRadius("browser", Number.NaN);
  await tick(state);
  expect(state.request).not.toHaveBeenCalled();
  expect([...state.timers.values()][0].delay).toBe(6000);
  state.source.disconnectClient("unknown");
  expect(state.timers.size).toBe(1);
  state.source.close();
  expect(state.clearTimeoutFn).toHaveBeenCalledTimes(1);
});

test("does not poll without clients or publish a result after disconnect", async () => {
  const state = setup({
    request: jest.fn(async () => ({ ok: true, json: async () => ({ aircraft: [] }) })),
  });
  expect(state.timers.size).toBe(0);
  state.source.connectClient("browser");
  const pending = tick(state);
  state.source.disconnectClient("browser");
  await pending;
  expect(state.request).toHaveBeenCalledTimes(1);
  expect(state.timers.size).toBe(0);
});

test("suppresses a late failure after disconnect and cancels scheduled polling", async () => {
  let rejectResponse;
  const request = jest.fn(() => new Promise((_resolve, reject) => (rejectResponse = reject)));
  const onError = jest.fn();
  const state = setup({ request, onError });
  state.source.connectClient("browser");
  const pending = tick(state);
  state.source.disconnectClient("browser");
  rejectResponse(new Error("late failure"));
  await pending;
  expect(onError).not.toHaveBeenCalled();
  expect(state.timers.size).toBe(0);
  state.source.close();
});

test("uses constructor defaults and safely handles request errors", async () => {
  const source = createAdsbLolRemoteSource({ location: null });
  expect(source.list()).toEqual([]);
  source.close();
  let fire;
  const active = createAdsbLolRemoteSource({
    location: { latitude: 43, longitude: -70 },
    request: async () => ({ ok: false, status: 429 }),
    setTimeoutFn: (callback) => ((fire = callback), 1),
    clearTimeoutFn: jest.fn(),
  });
  active.connectClient("browser");
  await fire();
  active.close();
});

test("publishes a successful route lookup update", async () => {
  const subscriber = jest.fn();
  const state = setup({
    lookup: { getCallsignRoute: jest.fn(async () => ({ origin: "PWM", destination: "BOS" })) },
    request: jest.fn(async () => ({
      ok: true,
      json: async () => ({
        aircraft: [
          { hex: "abc123", lat: 43.9, lon: -70.3, seen: 0.4, seen_pos: 0.8, flight: "EJA123" },
        ],
      }),
    })),
  });
  state.source.subscribe(subscriber);
  state.source.connectClient("browser");
  await tick(state);
  await Promise.resolve();
  expect(subscriber).toHaveBeenCalledTimes(2);
  expect(state.source.list()).toMatchObject([{ origin: "PWM", destination: "BOS" }]);
  state.source.close();
});

test("forwards route lookup settings to the aircraft store", () => {
  const state = setup();
  state.source.setRouteLookupsEnabled(false);
  state.source.setRouteLookupsEnabled(true);
  state.source.close();
});
