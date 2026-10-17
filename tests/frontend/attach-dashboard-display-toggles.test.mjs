import { expect, jest, test } from "@jest/globals";
import { attachDashboardDisplayToggles } from "../../src/frontend/attach-dashboard-display-toggles.mjs";

test("attaches strip and METAR toggles and notifies their controllers", () => {
  const listeners = [];
  const panel = { hidden: false };
  const strips = { hidden: false };
  const dashboard = { classList: { toggle: jest.fn() } };
  const document = {
    querySelector: (selector) =>
      ({ ".dashboard": dashboard, "[data-flight-strips]": strips, "[data-metar]": panel })[
        selector
      ],
    addEventListener: (_type, listener) => listeners.push(listener),
    removeEventListener: jest.fn(),
  };
  const fetchData = jest.fn(() => Promise.resolve());
  const metarChanged = jest.fn();
  const detach = attachDashboardDisplayToggles(document, fetchData, metarChanged);

  listeners.forEach((listener) => listener({ key: "f", preventDefault: jest.fn() }));
  listeners.forEach((listener) => listener({ key: "m", preventDefault: jest.fn() }));

  expect(strips.hidden).toBe(true);
  expect(dashboard.classList.toggle).toHaveBeenCalledWith("flight-strips-hidden", true);
  expect(fetchData).toHaveBeenCalledWith(
    "/api/route-lookups",
    expect.objectContaining({ method: "POST" }),
  );
  expect(panel.hidden).toBe(true);
  expect(metarChanged).toHaveBeenCalledWith(false);
  detach.detachFlightStripsToggle();
  detach.detachMetarDisplayToggle();
  expect(document.removeEventListener).toHaveBeenCalledTimes(2);
});

test("restores hidden states and stores visibility changes", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map([
    ["radar.visibility.flightStrips", "false"],
    ["radar.visibility.metar", "false"],
  ]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
  const listeners = [];
  const panel = { hidden: false };
  const strips = { hidden: false };
  const dashboard = { classList: { toggle: jest.fn() } };
  const document = {
    querySelector: (selector) =>
      ({ ".dashboard": dashboard, "[data-flight-strips]": strips, "[data-metar]": panel })[
        selector
      ],
    addEventListener: (_type, listener) => listeners.push(listener),
    removeEventListener: jest.fn(),
  };
  attachDashboardDisplayToggles(
    document,
    jest.fn(() => Promise.resolve()),
    jest.fn(),
  );
  expect(strips.hidden).toBe(true);
  expect(panel.hidden).toBe(true);
  listeners[0]({ key: "f", preventDefault: jest.fn() });
  expect(values.get("radar.visibility.flightStrips")).toBe("true");
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete globalThis.localStorage;
});

test("ignores route lookup toggle request failures", async () => {
  const dashboard = { classList: { toggle: jest.fn() } };
  const document = {
    querySelector: (selector) =>
      ({
        ".dashboard": dashboard,
        "[data-flight-strips]": { hidden: false },
        "[data-metar]": { hidden: false },
      })[selector],
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const fetchData = jest.fn().mockRejectedValue(new Error("offline"));
  const toggles = attachDashboardDisplayToggles(document, fetchData, jest.fn());
  await Promise.resolve();
  expect(fetchData).toHaveBeenCalledTimes(1);
  toggles.detachFlightStripsToggle();
  toggles.detachMetarDisplayToggle();
});
