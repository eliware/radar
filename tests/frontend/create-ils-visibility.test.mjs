import { createIlsVisibility } from "../../src/frontend/create-ils-visibility.mjs";
import { expect, test } from "@jest/globals";

test("sets visibility and notifies the view", () => {
  const changes = [];
  let removed = false;
  const documentRef = {
    addEventListener: () => {},
    removeEventListener: () => {
      removed = true;
    },
  };
  const visibility = createIlsVisibility(documentRef, (value) => changes.push(value));
  expect(visibility.isVisible()).toBe(true);
  visibility.setVisible(false);
  expect(visibility.isVisible()).toBe(false);
  visibility.setVisible(true);
  expect(changes).toEqual([false, true]);
  visibility.destroy();
  expect(removed).toBe(true);
});

test("supports a missing document", () => {
  const visibility = createIlsVisibility(null);
  expect(visibility.isVisible()).toBe(true);
  visibility.setVisible(false);
  expect(visibility.isVisible()).toBe(false);
});
