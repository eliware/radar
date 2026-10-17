import { expect, jest, test } from "@jest/globals";
import { createReferenceVisibility } from "../../src/frontend/create-reference-visibility.mjs";

test("toggles airport and VOR visibility with A and N", () => {
  let listener;
  const onChange = jest.fn();
  const visibility = createReferenceVisibility(
    { addEventListener: (_type, fn) => (listener = fn) },
    onChange,
  );
  const send = (key) => listener({ key, target: {}, preventDefault: jest.fn() });
  expect(visibility.isAirportsVisible()).toBe(true);
  expect(visibility.isNavaidsVisible()).toBe(true);
  send("a");
  send("n");
  visibility.setAirportsVisible(true);
  visibility.setNavaidsVisible(true);
  visibility.setAirportsVisible(false);
  visibility.setVisible("unknown", true);
  expect(visibility.isAirportsVisible()).toBe(false);
  expect(visibility.isNavaidsVisible()).toBe(true);
  expect(onChange).toHaveBeenLastCalledWith({ airportsVisible: false, navaidsVisible: true });
});

test("ignores other, modified, and editable key events", () => {
  let listener;
  const visibility = createReferenceVisibility({
    addEventListener: (_type, fn) => (listener = fn),
  });
  for (const event of [
    { key: "x" },
    { key: "a", altKey: true },
    { key: "n", ctrlKey: true },
    { key: "a", target: { tagName: "INPUT" } },
    { key: "n", target: { isContentEditable: true } },
  ])
    listener(event);
  expect(visibility.isAirportsVisible()).toBe(true);
  expect(visibility.isNavaidsVisible()).toBe(true);
  visibility.destroy();
});

test("supports missing document methods", () => {
  const visibility = createReferenceVisibility(null);
  visibility.setAirportsVisible(false);
  expect(() => visibility.destroy()).not.toThrow();
});
