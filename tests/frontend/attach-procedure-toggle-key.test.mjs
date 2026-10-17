import { expect, jest, test } from "@jest/globals";
import { attachProcedureToggleKey } from "../../src/frontend/attach-procedure-toggle-key.mjs";

function event(key, extra = {}) {
  return { key, target: {}, preventDefault: jest.fn(), ...extra };
}

test("toggles SIDs with D and STARs with S outside editable elements", () => {
  let listener;
  const documentRef = {
    addEventListener: jest.fn((type, callback) => {
      listener = callback;
    }),
    removeEventListener: jest.fn(),
  };
  const toggleSid = jest.fn();
  const toggleStar = jest.fn();
  const detach = attachProcedureToggleKey(documentRef, toggleSid, toggleStar);
  for (const value of [
    event("x"),
    event("d", { ctrlKey: true }),
    event("D", { target: { tagName: "INPUT" } }),
    event("s", { target: { isContentEditable: true } }),
  ])
    listener(value);
  const accepted = event("D");
  listener(accepted);
  const acceptedStar = event("S");
  listener(acceptedStar);
  expect(toggleSid).toHaveBeenCalledTimes(1);
  expect(toggleStar).toHaveBeenCalledTimes(1);
  expect(accepted.preventDefault).toHaveBeenCalledTimes(1);
  expect(acceptedStar.preventDefault).toHaveBeenCalledTimes(1);
  detach();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", listener);
});

test("supports absent document listeners", () => {
  expect(() => attachProcedureToggleKey(null, jest.fn())()).not.toThrow();
});
