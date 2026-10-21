import { expect, jest, test } from "@jest/globals";
import { createRunwayVisibility } from "../../../src/frontend/create/runway-visibility.mjs";

test("enables runway layers by default and toggles R, E, and B independently", () => {
  let listener;
  const onChange = jest.fn();
  const visibility = createRunwayVisibility(
    { addEventListener: (_type, callback) => (listener = callback) },
    onChange,
  );
  expect(visibility.isRunwaysVisible()).toBe(true);
  expect(visibility.isExtensionsVisible()).toBe(true);
  expect(visibility.isBaseLegsVisible()).toBe(true);
  listener({ key: "r", target: {}, preventDefault: jest.fn() });
  listener({ key: "e", target: {}, preventDefault: jest.fn() });
  listener({ key: "b", target: {}, preventDefault: jest.fn() });
  visibility.setRunwaysVisible(true);
  visibility.setExtensionsVisible(true);
  visibility.setBaseLegsVisible(true);
  visibility.setRunwaysVisible(false);
  visibility.setVisible("other", true);
  expect(visibility.isRunwaysVisible()).toBe(false);
  expect(visibility.isExtensionsVisible()).toBe(true);
  expect(visibility.isBaseLegsVisible()).toBe(true);
  expect(onChange).toHaveBeenLastCalledWith({
    runwaysVisible: false,
    extensionsVisible: true,
    baseLegsVisible: true,
  });
});

test("ignores modified and editable runway keys and removes its handler", () => {
  let listener;
  const removeEventListener = jest.fn();
  const visibility = createRunwayVisibility({
    addEventListener: (_type, callback) => (listener = callback),
    removeEventListener,
  });
  for (const event of [
    { key: "r", altKey: true },
    { key: "e", target: { tagName: "INPUT" } },
    { key: "b", altKey: true },
    { key: "r", target: { isContentEditable: true } },
    { key: "x" },
  ])
    listener({ target: {}, preventDefault: jest.fn(), ...event });
  expect(visibility.isRunwaysVisible()).toBe(true);
  expect(visibility.isExtensionsVisible()).toBe(true);
  expect(visibility.isBaseLegsVisible()).toBe(true);
  visibility.destroy();
  expect(removeEventListener).toHaveBeenCalledWith("keydown", listener);
});

test("uses the default change callback", () => {
  const visibility = createRunwayVisibility(null);
  visibility.setRunwaysVisible(false);
  expect(visibility.isRunwaysVisible()).toBe(false);
});
