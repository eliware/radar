import { expect, jest, test } from "@jest/globals";
import { createAirwayVisibility } from "../../../src/frontend/create/airway-visibility.mjs";

test("starts Q, J, and V airway layers visible and toggles them independently", () => {
  let listener;
  const documentRef = {
    addEventListener: (_type, callback) => (listener = callback),
    removeEventListener: jest.fn(),
  };
  const onChange = jest.fn();
  const visibility = createAirwayVisibility(documentRef, onChange);
  expect(["Q", "J", "V"].map((type) => visibility.isVisible(type))).toEqual([true, true, true]);
  const preventDefault = jest.fn();
  listener({ key: "q", target: {}, preventDefault });
  listener({ key: "j", target: {}, preventDefault });
  listener({ key: "v", target: {}, preventDefault });
  expect(visibility.isVisible("Q")).toBe(false);
  expect(visibility.isVisible("J")).toBe(false);
  expect(visibility.isVisible("V")).toBe(false);
  expect(preventDefault).toHaveBeenCalledTimes(3);
  expect(onChange).toHaveBeenCalledWith({ Q: false, J: false, V: false });
  visibility.setVisible("Q", true);
  visibility.destroy();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", listener);
});

test("ignores modified or editable Q, J, and V key events", () => {
  let listener;
  const visibility = createAirwayVisibility({
    addEventListener: (_type, callback) => (listener = callback),
  });
  for (const event of [
    { key: "q", ctrlKey: true },
    { key: "j", target: { tagName: "TEXTAREA" } },
    { key: "v", target: { isContentEditable: true } },
    { key: "x" },
  ])
    listener({ target: {}, preventDefault: jest.fn(), ...event });
  expect(["Q", "J", "V"].map((type) => visibility.isVisible(type))).toEqual([true, true, true]);
});

test("supports a missing document and ignores unknown visibility types", () => {
  const visibility = createAirwayVisibility(null);
  expect(visibility.isVisible("X")).toBe(false);
  visibility.setVisible("X", false);
  visibility.setVisible("Q", false);
  visibility.destroy();
  expect(true).toBe(true);
});
