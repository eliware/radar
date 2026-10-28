import { expect, jest, test } from "@jest/globals";
import { createReferenceVisibility } from "../../../src/frontend/create/reference-visibility.mjs";

test("stores airport and navaid visibility and reports changes", () => {
  const onChange = jest.fn();
  const visibility = createReferenceVisibility(onChange);
  expect(visibility.isAirportsVisible()).toBe(true);
  expect(visibility.isNavaidsVisible()).toBe(true);
  visibility.setAirportsVisible(false);
  visibility.setNavaidsVisible(false);
  visibility.setVisible("unknown", true);
  expect(visibility.isAirportsVisible()).toBe(false);
  expect(visibility.isNavaidsVisible()).toBe(false);
  expect(onChange).toHaveBeenLastCalledWith({ airportsVisible: false, navaidsVisible: false });
  expect(onChange).toHaveBeenCalledTimes(2);
});

test("uses the default change callback", () => {
  const visibility = createReferenceVisibility();
  visibility.setAirportsVisible(false);
  expect(visibility.isAirportsVisible()).toBe(false);
});
