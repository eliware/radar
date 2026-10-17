import { expect, jest, test } from "@jest/globals";
import { createProcedureVisibility } from "../../../src/frontend/create/procedure-visibility.mjs";

test("starts visible and toggles SID and STAR visibility independently", () => {
  let listener;
  const documentRef = {
    addEventListener: (_type, callback) => {
      listener = callback;
    },
  };
  const onChange = jest.fn();
  const visibility = createProcedureVisibility(documentRef, onChange);
  expect(visibility.isSidVisible()).toBe(true);
  expect(visibility.isStarVisible()).toBe(true);
  listener({ key: "d", target: {}, preventDefault() {} });
  expect(visibility.isSidVisible()).toBe(false);
  expect(visibility.isStarVisible()).toBe(true);
  listener({ key: "s", target: {}, preventDefault() {} });
  expect(visibility.isStarVisible()).toBe(false);
  visibility.setSidVisible(1);
  expect(visibility.isSidVisible()).toBe(true);
  expect(onChange.mock.calls.map(([value]) => value)).toEqual([
    { sidVisible: false, starVisible: true },
    { sidVisible: false, starVisible: false },
    { sidVisible: true, starVisible: false },
  ]);
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
  visibility.setStarVisible(false);
  expect(visibility.isStarVisible()).toBe(false);
  visibility.destroy();
});
