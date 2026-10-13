import { expect, jest, test } from "@jest/globals";
import { createProcedureVisibility } from "../../src/frontend/create-procedure-visibility.mjs";

test("starts visible, toggles with S, and accepts explicit visibility", () => {
  let listener;
  const documentRef = {
    addEventListener: (_type, callback) => {
      listener = callback;
    },
  };
  const onChange = jest.fn();
  const visibility = createProcedureVisibility(documentRef, onChange);
  expect(visibility.isVisible()).toBe(true);
  listener({ key: "s", target: {}, preventDefault() {} });
  expect(visibility.isVisible()).toBe(false);
  visibility.setVisible(1);
  expect(visibility.isVisible()).toBe(true);
  expect(onChange.mock.calls.map(([value]) => value)).toEqual([false, true]);
});

test("removes its keyboard listener on destroy", () => {
  const removeEventListener = jest.fn();
  const visibility = createProcedureVisibility({
    addEventListener: jest.fn(),
    removeEventListener,
  });
  visibility.destroy();
  expect(removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});

test("uses the default change callback when none is supplied", () => {
  const visibility = createProcedureVisibility(null);
  visibility.setVisible(false);
  expect(visibility.isVisible()).toBe(false);
  visibility.destroy();
});
