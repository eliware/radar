import { expect, jest, test } from "@jest/globals";
import { createDashboardDisplaySetup } from "../../../src/frontend/dashboard/display-setup.mjs";

test("creates the flight-strip view and dashboard display controls together", () => {
  const listeners = [];
  const flightPanel = { clientWidth: 300, hidden: false, innerHTML: "" };
  const dashboard = { classList: { toggle: jest.fn() } };
  const metar = { hidden: false };
  const document = {
    querySelector: (selector) =>
      ({ "[data-flight-strips]": flightPanel, ".dashboard": dashboard, "[data-metar]": metar })[
        selector
      ],
    addEventListener: (_name, listener) => listeners.push(listener),
    removeEventListener: jest.fn(),
  };
  const windowRef = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn(() => 17),
    clearInterval: jest.fn(),
  };
  const display = createDashboardDisplaySetup({
    document,
    fetchData: jest.fn(() => Promise.resolve()),
    windowRef,
    onMetarEnabled: jest.fn(),
  });
  expect(display.flightStrips).toEqual(
    expect.objectContaining({
      updateSnapshot: expect.any(Function),
      destroy: expect.any(Function),
    }),
  );
  expect(display.toggles).toEqual(
    expect.objectContaining({ detachFlightStripsToggle: expect.any(Function) }),
  );
  expect(display.startMetarRefresh).toEqual(expect.any(Function));
  display.flightStrips.destroy();
  display.toggles.detachFlightStripsToggle();
  display.toggles.detachMetarDisplayToggle();
  expect(document.removeEventListener).toHaveBeenCalled();
  expect(listeners).toHaveLength(2);
});
