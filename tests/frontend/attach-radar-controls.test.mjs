import { expect, jest, test } from "@jest/globals";
import { attachRadarControls } from "../../src/frontend/attach-radar-controls.mjs";

function makeButton(name) {
  const listeners = new Map();
  return {
    dataset: { radarControl: name },
    addEventListener: jest.fn((event, callback) => listeners.set(event, callback)),
    removeEventListener: jest.fn(),
    click: () => listeners.get("click")?.(),
  };
}

test("binds view controls and disables tilt when the view cannot tilt", () => {
  const buttons = [
    "zoom-in",
    "zoom-out",
    "rotate-left",
    "rotate-right",
    "tilt-top",
    "tilt-horizon",
    "unknown",
  ].map(makeButton);
  const view = { zoom: jest.fn(), rotate: jest.fn() };
  const detach = attachRadarControls({ querySelectorAll: () => buttons }, view);
  buttons.slice(0, 4).forEach((button) => button.click());
  expect(view.zoom).toHaveBeenNthCalledWith(1, 0.8);
  expect(view.zoom).toHaveBeenNthCalledWith(2, 1.25);
  expect(view.rotate).toHaveBeenNthCalledWith(1, 1);
  expect(view.rotate).toHaveBeenNthCalledWith(2, -1);
  expect(buttons[4].disabled).toBe(true);
  expect(buttons[5].disabled).toBe(true);
  expect(buttons[6].addEventListener).not.toHaveBeenCalled();
  detach();
  expect(buttons[0].removeEventListener).toHaveBeenCalledWith("click", expect.any(Function));
});

test("binds tilt controls for the three-dimensional view", () => {
  const buttons = [makeButton("tilt-top"), makeButton("tilt-horizon")];
  const view = { tilt: jest.fn() };
  attachRadarControls({ querySelectorAll: () => buttons }, view);
  buttons.forEach((button) => button.click());
  expect(buttons.every((button) => !button.disabled)).toBe(true);
  expect(view.tilt).toHaveBeenNthCalledWith(1, -1);
  expect(view.tilt).toHaveBeenNthCalledWith(2, 1);
});
