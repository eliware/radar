import { expect, jest, test } from "@jest/globals";
import { attachProcedureToggleKey } from "../../src/frontend/attach-procedure-toggle-key.mjs";

function event(key, extra = {}) {
  return { key, target: {}, preventDefault: jest.fn(), ...extra };
}

test("toggles only for an unmodified S key outside editable elements", () => {
  let listener;
  const documentRef = {
    addEventListener: jest.fn((type, callback) => {
      listener = callback;
    }),
    removeEventListener: jest.fn(),
  };
  const toggle = jest.fn();
  const detach = attachProcedureToggleKey(documentRef, toggle);
  for (const value of [
    event("x"),
    event("s", { ctrlKey: true }),
    event("S", { target: { tagName: "INPUT" } }),
    event("s", { target: { isContentEditable: true } }),
  ])
    listener(value);
  const accepted = event("S");
  listener(accepted);
  expect(toggle).toHaveBeenCalledTimes(1);
  expect(accepted.preventDefault).toHaveBeenCalledTimes(1);
  detach();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", listener);
});

test("supports absent document listeners", () => {
  expect(() => attachProcedureToggleKey(null, jest.fn())()).not.toThrow();
});
