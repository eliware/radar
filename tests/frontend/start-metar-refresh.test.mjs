import { expect, jest, test } from "@jest/globals";
import { startMetarRefresh } from "../../src/frontend/start-metar-refresh.mjs";

function elements() {
  return { panel: { textContent: "", innerHTML: "" }, ticker: { textContent: "" } };
}

test("loads reports at startup and schedules five-minute refreshes", async () => {
  const nodes = elements();
  const fetchData = jest.fn(async () => ({
    ok: true,
    json: async () => ({ reports: [{ id: "KPWM", metar: "04006KT" }] }),
  }));
  const timerHost = { setInterval: jest.fn((callback, delay) => ({ callback, delay })) };
  const timer = startMetarRefresh({ fetchData, ...nodes, timerHost });
  await Promise.resolve();
  await Promise.resolve();
  expect(timer.delay).toBe(300000);
  expect(timerHost.setInterval).toHaveBeenCalledTimes(1);
  expect(nodes.panel.innerHTML).toContain("KPWM");
});

test("shows an empty state when the API returns an error", async () => {
  const nodes = elements();
  startMetarRefresh({ fetchData: async () => ({ ok: false }), ...nodes });
  await Promise.resolve();
  await Promise.resolve();
  expect(nodes.panel.textContent).toBe("No METAR reports available.");
});

test("supports missing elements and timer hosts", () => {
  expect(startMetarRefresh({ fetchData: async () => ({ ok: true, json: async () => ({}) }) })).toBe(
    null,
  );
});
