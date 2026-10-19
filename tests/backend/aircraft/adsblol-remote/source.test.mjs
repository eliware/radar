import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRemoteSource } from "../../../../src/backend/aircraft/adsblol-remote/source.mjs";

function setup(overrides = {}) {
  const timers = new Map();
  const setIntervalFn = jest.fn((callback, delay) => (timers.set(7, { callback, delay }), 7));
  const clearIntervalFn = jest.fn((id) => timers.delete(id));
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft: [] }) }));
  const options = {
    location: { latitude: 43.8, longitude: -70.4 },
    defaultRangeNm: 25,
    request,
    setIntervalFn,
    clearIntervalFn,
    ...overrides,
  };
  return {
    timers,
    request: options.request,
    setIntervalFn,
    clearIntervalFn,
    source: createAdsbLolRemoteSource(options),
  };
}

test("polls every five seconds for the largest connected-client radius", async () => {
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
  state.source.connectClient("desktop");
  state.source.setClientRadius("phone", 42.1);
  state.source.setClientRadius("desktop", 530);
  expect(state.setIntervalFn).toHaveBeenCalledWith(expect.any(Function), 5000);
  expect(state.request).not.toHaveBeenCalled();
  await state.timers.get(7).callback();
  expect(state.request.mock.calls[0][0]).toContain("circle=43.8,-70.4,300");
  expect(state.request.mock.calls[0][1].headers["user-agent"]).toContain("radar@eliware.org");
  expect(state.source.list()).toMatchObject([{ icao: "ABC123", aircraftTypeCode: "E75L" }]);
  expect(subscriber).toHaveBeenCalledTimes(1);
  state.source.disconnectClient("phone");
  expect(state.timers.has(7)).toBe(true);
  state.source.disconnectClient("desktop");
  expect(state.clearIntervalFn).toHaveBeenCalledWith(7);
  expect(state.source.list()).toEqual([]);
  state.source.disconnectClient("another");
});

test("does not poll with no clients and isolates API failures", async () => {
  const onError = jest.fn();
  const state = setup({ request: jest.fn(async () => ({ ok: false, status: 503 })), onError });
  expect(state.timers.size).toBe(0);
  state.source.connectClient("browser");
  await state.timers.get(7).callback();
  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({ message: expect.stringContaining("503") }),
  );
  state.source.disconnectClient("browser");
  await state.timers.get(7)?.callback?.();
  expect(state.request).toHaveBeenCalledTimes(1);
});

test("uses route lookups only when enabled and the re-api route is absent", async () => {
  const lookup = {
    getCallsignRoute: jest.fn(async () => ({ origin: "KBOS", destination: "KORD" })),
  };
  const request = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      aircraft: [
        {
          hex: "abc123",
          lat: 43.9,
          lon: -70.3,
          seen: 0,
          seen_pos: 0,
          t: "E75L",
          flight: "RPA3471",
        },
      ],
    }),
  }));
  const state = setup({ request, lookup });
  state.source.setRouteLookupsEnabled(false);
  state.source.connectClient("browser");
  await state.timers.get(7).callback();
  expect(lookup.getCallsignRoute).not.toHaveBeenCalled();
  state.source.setRouteLookupsEnabled(true);
  await state.timers.get(7).callback();
  await Promise.resolve();
  expect(lookup.getCallsignRoute).toHaveBeenCalledWith("RPA3471");
  expect(state.source.list()[0]).toMatchObject({ origin: "KBOS", destination: "KORD" });
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
  await state.timers.get(7).callback();
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
  await state.timers.get(7).callback();
  expect(state.request).not.toHaveBeenCalled();
  state.source.disconnectClient("unknown");
  expect(state.timers.size).toBe(1);
  state.source.close();
  expect(state.clearIntervalFn).toHaveBeenCalledWith(7);
});

test("skips overlapping polls and discards results after the last client leaves", async () => {
  let resolveResponse;
  const request = jest.fn(() => new Promise((resolve) => (resolveResponse = resolve)));
  const state = setup({ request });
  state.source.connectClient("browser");
  const poll = state.timers.get(7).callback;
  const first = poll();
  await poll();
  expect(request).toHaveBeenCalledTimes(1);
  state.source.disconnectClient("browser");
  resolveResponse({ ok: true, json: async () => ({ aircraft: [] }) });
  await first;
  expect(state.source.list()).toEqual([]);
  await poll();
  expect(request).toHaveBeenCalledTimes(1);
  state.source.close();
});

test("uses constructor defaults without opening the poll timer", async () => {
  const source = createAdsbLolRemoteSource({ location: null });
  expect(source.list()).toEqual([]);
  source.close();
  const state = setup({ request: jest.fn(async () => ({ ok: false, status: 503 })) });
  state.source.connectClient("browser");
  await state.timers.get(7).callback();
  state.source.disconnectClient("browser");
});

test("closes an active source and clears its client timer", () => {
  const state = setup();
  state.source.subscribe(jest.fn());
  state.source.connectClient("browser");
  state.source.close();
  expect(state.clearIntervalFn).toHaveBeenCalledWith(7);
  expect(state.source.list()).toEqual([]);
});

test("suppresses a failed response after the last client disconnects", async () => {
  let rejectResponse;
  const request = jest.fn(() => new Promise((_resolve, reject) => (rejectResponse = reject)));
  const onError = jest.fn();
  const state = setup({ request, onError });
  state.source.connectClient("browser");
  const poll = state.timers.get(7).callback;
  const pending = poll();
  state.source.disconnectClient("browser");
  rejectResponse(new Error("late failure"));
  await pending;
  expect(onError).not.toHaveBeenCalled();
});
