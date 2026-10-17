import { expect, jest, test } from "@jest/globals";
import { createWaterVisibility } from "../../../../src/frontend/create/water/visibility.mjs";

test("starts visible and reports each W key change", () => {
  let listener;
  const documentRef = { addEventListener: (_name, callback) => (listener = callback) };
  const onChange = jest.fn();
  const visibility = createWaterVisibility(documentRef, onChange);

  expect(visibility.isVisible()).toBe(true);
  listener({ key: "w", preventDefault: jest.fn() });
  expect(visibility.isVisible()).toBe(false);
  listener({ key: "w", preventDefault: jest.fn() });
  expect(visibility.isVisible()).toBe(true);
  expect(onChange.mock.calls.map(([value]) => value)).toEqual([false, true]);
  visibility.destroy();
});

test("supports a missing document and default change handler", () => {
  const visibility = createWaterVisibility(null);
  expect(visibility.isVisible()).toBe(true);
  expect(() => visibility.destroy()).not.toThrow();

  let listener;
  const withDefaultHandler = createWaterVisibility({
    addEventListener: (_name, callback) => (listener = callback),
  });
  listener({ key: "w", preventDefault: jest.fn() });
  expect(withDefaultHandler.isVisible()).toBe(false);
  withDefaultHandler.destroy();
});
