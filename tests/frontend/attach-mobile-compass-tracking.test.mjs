import { expect, jest, test } from "@jest/globals";
import { attachMobileCompassTracking } from "../../src/frontend/attach-mobile-compass-tracking.mjs";

function setup({ secure = true, sensor = {}, view = { setRotation: jest.fn() } } = {}) {
  const listeners = new Map();
  const buttonListeners = new Map();
  const button = {
    textContent: "FOLLOW PHONE",
    addEventListener: jest.fn((name, callback) => buttonListeners.set(name, callback)),
    removeEventListener: jest.fn(),
    setAttribute: jest.fn(),
  };
  const documentRef = { querySelector: jest.fn(() => button) };
  const windowRef = {
    isSecureContext: secure,
    DeviceOrientationEvent: sensor,
    addEventListener: jest.fn((name, callback) => listeners.set(name, callback)),
    removeEventListener: jest.fn((name) => listeners.delete(name)),
  };
  return {
    button,
    documentRef,
    windowRef,
    view,
    click: () => buttonListeners.get("click")(),
    send: (event) => listeners.get("deviceorientation")?.(event),
  };
}

test("tracks iOS compass heading and stops on the next tap", async () => {
  const state = setup({ sensor: { requestPermission: jest.fn().mockResolvedValue("granted") } });
  const detach = attachMobileCompassTracking(state.documentRef, state.windowRef, state.view);
  await state.click();
  state.send({ webkitCompassHeading: 140, alpha: 3, absolute: false });
  expect(state.view.setRotation).toHaveBeenCalledWith((140 * Math.PI) / 180);
  expect(state.button.textContent).toBe("PHONE ACTIVE");
  await state.click();
  expect(state.windowRef.removeEventListener).toHaveBeenCalledWith(
    "deviceorientation",
    expect.any(Function),
  );
  expect(state.button.textContent).toBe("FOLLOW PHONE");
  detach();
});

test("uses absolute alpha on browsers without the iOS heading field", async () => {
  const state = setup();
  attachMobileCompassTracking(state.documentRef, state.windowRef, state.view);
  await state.click();
  state.send({ alpha: 220, absolute: true });
  expect(state.view.setRotation).toHaveBeenCalledWith((140 * Math.PI) / 180);
  state.send({ alpha: 30, absolute: false });
  expect(state.view.setRotation).toHaveBeenCalledTimes(1);
});

test("reports unsupported, insecure, and denied access", async () => {
  const unsupported = setup({ sensor: null });
  attachMobileCompassTracking(unsupported.documentRef, unsupported.windowRef, unsupported.view);
  await unsupported.click();
  expect(unsupported.button.textContent).toBe("NO COMPASS");

  const insecure = setup({ secure: false });
  attachMobileCompassTracking(insecure.documentRef, insecure.windowRef, insecure.view);
  await insecure.click();
  expect(insecure.button.textContent).toBe("HTTPS REQUIRED");

  const denied = setup({ sensor: { requestPermission: jest.fn().mockResolvedValue("denied") } });
  attachMobileCompassTracking(denied.documentRef, denied.windowRef, denied.view);
  await denied.click();
  expect(denied.button.textContent).toBe("PERMISSION BLOCKED");
  expect(denied.windowRef.addEventListener).not.toHaveBeenCalled();
});

test("handles rejected permission, invalid data, and missing controls", async () => {
  const rejected = setup({ sensor: { requestPermission: jest.fn().mockRejectedValue(Error()) } });
  attachMobileCompassTracking(rejected.documentRef, rejected.windowRef, rejected.view);
  await rejected.click();
  expect(rejected.button.textContent).toBe("PERMISSION BLOCKED");
  const state = setup();
  attachMobileCompassTracking(state.documentRef, state.windowRef, state.view);
  await state.click();
  for (const event of [{ alpha: null, absolute: true }, { alpha: 80, absolute: false }, {}])
    state.send(event);
  expect(state.view.setRotation).not.toHaveBeenCalled();
  expect(attachMobileCompassTracking(null, state.windowRef, state.view)).not.toThrow();
  expect(
    attachMobileCompassTracking({ querySelector: () => null }, state.windowRef, state.view),
  ).not.toThrow();
});
