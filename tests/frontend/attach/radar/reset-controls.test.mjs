import { expect, jest, test } from "@jest/globals";
import { attachRadarResetControls } from "../../../../src/frontend/attach/radar/reset-controls.mjs";

function setup() {
  const documentListeners = new Map();
  const compassListeners = new Map();
  const compass = {
    addEventListener: jest.fn((name, callback) => compassListeners.set(name, callback)),
    removeEventListener: jest.fn(),
  };
  const documentRef = {
    querySelector: jest.fn(() => compass),
    addEventListener: jest.fn((name, callback) => documentListeners.set(name, callback)),
    removeEventListener: jest.fn(),
  };
  return {
    compass,
    documentRef,
    sendKey: (event) => documentListeners.get("keydown")(event),
    sendCompassKey: (event) => compassListeners.get("keydown")(event),
    clickCompass: () => compassListeners.get("click")(),
  };
}

test("resets with Home, compass click, and accessible compass keys", () => {
  const state = setup();
  const view = { reset: jest.fn() };
  const preventDefault = jest.fn();
  const detach = attachRadarResetControls(state.documentRef, view);

  state.sendKey({ key: "Home", preventDefault });
  state.clickCompass();
  state.sendCompassKey({ key: "Enter", preventDefault });
  state.sendCompassKey({ key: " ", preventDefault });

  expect(view.reset).toHaveBeenCalledTimes(4);
  expect(preventDefault).toHaveBeenCalledTimes(3);
  detach();
  expect(state.documentRef.removeEventListener).toHaveBeenCalledWith(
    "keydown",
    expect.any(Function),
  );
  expect(state.compass.removeEventListener).toHaveBeenCalledWith("click", expect.any(Function));
  expect(state.compass.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});

test("ignores other keys, modifiers, and editable targets", () => {
  const state = setup();
  const view = { reset: jest.fn() };
  attachRadarResetControls(state.documentRef, view);

  for (const event of [
    {},
    { key: "x" },
    { key: "r" },
    { key: "Home", altKey: true },
    { key: "Home", ctrlKey: true },
    { key: "Home", metaKey: true },
    { key: "Home", target: { tagName: "INPUT" } },
    { key: "Home", target: { tagName: "TEXTAREA" } },
    { key: "Home", target: { tagName: "SELECT" } },
    { key: "Home", target: { isContentEditable: true } },
  ])
    state.sendKey(event);

  state.sendCompassKey({ key: "Escape", preventDefault: jest.fn() });
  expect(view.reset).not.toHaveBeenCalled();
});

test("supports missing document and compass event methods", () => {
  const reset = jest.fn();
  expect(() => attachRadarResetControls(null, { reset })()).not.toThrow();
  const detach = attachRadarResetControls({ querySelector: () => ({}) }, { reset });
  expect(() => detach()).not.toThrow();
  const noQuery = attachRadarResetControls({ addEventListener: jest.fn() }, { reset });
  expect(() => noQuery()).not.toThrow();
});
