import { expect, jest, test } from "@jest/globals";
import { default as startMetarRefresh } from "../../../src/frontend/start/metar-refresh.mjs";

function elements() {
  return { panel: { textContent: "", innerHTML: "" }, ticker: { textContent: "" } };
}

test("requests reports at startup and schedules five-minute refreshes", async () => {
  const nodes = elements();
  const fetchData = jest.fn(async () => ({
    ok: true,
    json: async () => ({ reports: [{ id: "KPWM", metar: "04006KT" }] }),
  }));
  const timerHost = {
    setInterval: jest.fn((callback, delay) => ({ callback, delay })),
    clearInterval: jest.fn(),
  };
  const refresh = startMetarRefresh({ fetchData, ...nodes, timerHost });
  await Promise.resolve();
  await Promise.resolve();
  const timer = timerHost.setInterval.mock.results[0].value;
  expect(timer.delay).toBe(300000);
  expect(timerHost.setInterval).toHaveBeenCalledTimes(1);
  expect(fetchData).toHaveBeenCalledWith("/api/metar");
  refresh.destroy();
  expect(timerHost.clearInterval).toHaveBeenCalledWith(timer);
});

test("pauses requests and restarts them when METARs are re-enabled", async () => {
  const nodes = elements();
  const fetchData = jest.fn(async () => ({ ok: true, json: async () => ({ reports: [] }) }));
  const timerHost = { setInterval: jest.fn((callback) => callback) };
  const refresh = startMetarRefresh({ fetchData, ...nodes, timerHost });
  await Promise.resolve();
  await Promise.resolve();
  refresh.setEnabled(false);
  await timerHost.setInterval.mock.calls[0][0]();
  expect(fetchData).toHaveBeenCalledTimes(1);
  refresh.setEnabled(true);
  await Promise.resolve();
  await Promise.resolve();
  expect(fetchData).toHaveBeenCalledTimes(2);
  refresh.destroy();
});

test("starts disabled without an initial or timer request", async () => {
  const fetchData = jest.fn();
  let tick;
  const refresh = startMetarRefresh({
    fetchData,
    ...elements(),
    enabled: false,
    timerHost: { setInterval: (callback) => (tick = callback) },
  });
  await tick();
  expect(fetchData).not.toHaveBeenCalled();
  refresh.setEnabled(true);
  await Promise.resolve();
  expect(fetchData).toHaveBeenCalledTimes(1);
  refresh.destroy();
});

test("supports missing elements and timer hosts", () => {
  const refresh = startMetarRefresh({
    fetchData: async () => ({ ok: true, json: async () => ({}) }),
  });
  expect(refresh).toEqual(expect.objectContaining({ setEnabled: expect.any(Function) }));
  refresh.destroy();
});
