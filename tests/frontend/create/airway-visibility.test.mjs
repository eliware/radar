import { expect, jest, test } from "@jest/globals";
import { createAirwayVisibility } from "../../../src/frontend/create/airway-visibility.mjs";

test("stores Q, J, and V airway state and reports changes", () => {
  const onChange = jest.fn();
  const visibility = createAirwayVisibility(onChange);
  expect(["Q", "J", "V"].map((type) => visibility.isVisible(type))).toEqual([true, true, true]);
  visibility.setVisible("Q", false);
  visibility.setVisible("J", false);
  visibility.setVisible("V", false);
  expect(["Q", "J", "V"].map((type) => visibility.isVisible(type))).toEqual([false, false, false]);
  expect(onChange).toHaveBeenLastCalledWith({ Q: false, J: false, V: false });
  visibility.setVisible("unknown", true);
  expect(onChange).toHaveBeenCalledTimes(3);
});

test("uses the default change callback", () => {
  const visibility = createAirwayVisibility();
  visibility.setVisible("Q", false);
  expect(visibility.isVisible("Q")).toBe(false);
});
