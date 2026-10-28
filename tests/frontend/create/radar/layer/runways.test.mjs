import { expect, jest, test } from "@jest/globals";
import { createRunwayVisibility } from "../../../../../src/frontend/create/radar/layer/runways.mjs";

test("stores runway layer state and reports changes", () => {
  const onChange = jest.fn();
  const visibility = createRunwayVisibility(onChange);
  expect([
    visibility.isRunwaysVisible(),
    visibility.isExtensionsVisible(),
    visibility.isBaseLegsVisible(),
  ]).toEqual([true, true, true]);
  visibility.setRunwaysVisible(false);
  visibility.setExtensionsVisible(false);
  visibility.setBaseLegsVisible(false);
  visibility.setVisible("other", true);
  expect([
    visibility.isRunwaysVisible(),
    visibility.isExtensionsVisible(),
    visibility.isBaseLegsVisible(),
  ]).toEqual([false, false, false]);
  expect(onChange).toHaveBeenLastCalledWith({
    runwaysVisible: false,
    extensionsVisible: false,
    baseLegsVisible: false,
  });
  expect(onChange).toHaveBeenCalledTimes(3);
});

test("uses the default change callback", () => {
  const visibility = createRunwayVisibility();
  visibility.setRunwaysVisible(false);
  expect(visibility.isRunwaysVisible()).toBe(false);
});
