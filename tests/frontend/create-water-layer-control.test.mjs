import { expect, jest, test } from "@jest/globals";
import { createWaterLayerControl } from "../../src/frontend/create-water-layer-control.mjs";

test("updates the water toggle and reports each visibility change", () => {
  const button = fakeButton();
  const onChange = jest.fn();
  const control = createWaterLayerControl({ querySelector: () => button }, onChange);
  expect(control.isVisible()).toBe(true);
  expect(button.textContent).toBe("WATER ON");
  button.handlers.click();
  expect(control.isVisible()).toBe(false);
  expect(button.attributes.get("aria-pressed")).toBe("false");
  expect(onChange.mock.calls.map(([value]) => value)).toEqual([true, false]);
  control.destroy();
  expect(button.handlers.click).toBeUndefined();
});

test("keeps the layer enabled when no toggle exists", () => {
  expect(createWaterLayerControl({ querySelector: () => null }, jest.fn()).isVisible()).toBe(true);
  expect(createWaterLayerControl(null, jest.fn()).isVisible()).toBe(true);
  expect(createWaterLayerControl({}, jest.fn()).isVisible()).toBe(true);
});

function fakeButton() {
  const button = {
    attributes: new Map(),
    handlers: {},
    setAttribute(key, value) {
      this.attributes.set(key, value);
    },
    addEventListener(key, handler) {
      this.handlers[key] = handler;
    },
    removeEventListener(key) {
      delete this.handlers[key];
    },
  };
  return button;
}
