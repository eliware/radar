import { expect, jest, test } from "@jest/globals";
import { createDashboardDisplay } from "../../../src/frontend/dashboard/display.mjs";

test("connects display toggles to METAR refresh and starts the refresh timer", async () => {
  const listeners = [];
  const dashboard = { classList: { toggle: jest.fn() } };
  const strips = { hidden: false };
  const metarPanel = { hidden: false, textContent: "", innerHTML: "" };
  const reports = { textContent: "", innerHTML: "" };
  const ticker = { textContent: "" };
  const elements = {
    ".dashboard": dashboard,
    "[data-flight-strips]": strips,
    "[data-metar]": metarPanel,
    "[data-metar-reports]": reports,
    "[data-metar-ticker]": ticker,
  };
  const document = {
    querySelector: (selector) => elements[selector],
    addEventListener: (_name, callback) => listeners.push(callback),
    removeEventListener: jest.fn(),
  };
  const fetchData = jest.fn(async (path) =>
    path === "/api/metar" ? { ok: true, json: async () => ({ reports: [] }) } : { ok: true },
  );
  const timerHost = { setInterval: jest.fn(() => 17), clearInterval: jest.fn() };
  const metarChanges = jest.fn();
  const display = createDashboardDisplay({
    document,
    fetchData,
    windowRef: timerHost,
    onMetarEnabled: metarChanges,
  });

  const metarRefresh = display.startMetarRefresh();
  listeners.forEach((listener) => listener({ key: "m", preventDefault: jest.fn() }));
  await Promise.resolve();
  await Promise.resolve();

  expect(metarChanges).toHaveBeenCalledWith(false);
  expect(timerHost.setInterval).toHaveBeenCalledWith(expect.any(Function), 300000);
  expect(reports.textContent).toBe("No METAR reports available.");
  metarRefresh.destroy();
  expect(timerHost.clearInterval).toHaveBeenCalledWith(17);
  display.toggles.detachFlightStripsToggle();
  display.toggles.detachMetarDisplayToggle();
});
