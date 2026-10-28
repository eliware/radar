import { expect, jest, test } from "@jest/globals";
import { attachDashboardCompassControls } from "../../../../src/frontend/attach/dashboard/compass-controls.mjs";

test("composes the compass controls and returns their detach functions", () => {
  const documentRef = {
    querySelector: (selector) =>
      selector === "[data-compass-follow]" ? button : elements[selector],
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const listeners = new Map();
  const buttonListeners = new Map();
  const button = {
    addEventListener: (name, callback) => buttonListeners.set(name, callback),
    removeEventListener: jest.fn(),
    setAttribute: jest.fn(),
  };
  const elements = {
    "[data-radar-compass]": {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setAttribute: jest.fn(),
    },
    "[data-compass-rose]": { setAttribute: jest.fn() },
    "[data-compass-heading]": {},
  };
  const windowRef = {
    DeviceOrientationEvent: null,
    addEventListener: jest.fn((name, callback) => listeners.set(name, callback)),
    removeEventListener: jest.fn(),
  };
  const controls = attachDashboardCompassControls(documentRef, windowRef, {});
  expect(Object.keys(controls)).toEqual([
    "detachCompass",
    "detachMobileCompass",
    "detachReset",
    "detachArrowControls",
  ]);
  expect(Object.values(controls).every((detach) => typeof detach === "function")).toBe(true);
});
