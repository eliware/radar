import { expect, jest, test } from "@jest/globals";
import { createViewChangeListeners } from "../../src/frontend/create-view-change-listeners.mjs";

test("notifies view listeners and removes them on unsubscribe", () => {
  const viewChanges = createViewChangeListeners();
  const listener = jest.fn();
  const unsubscribe = viewChanges.subscribe(listener);
  expect(listener).toHaveBeenCalledTimes(1);
  viewChanges.emit();
  expect(listener).toHaveBeenCalledTimes(2);
  unsubscribe();
  viewChanges.emit();
  expect(listener).toHaveBeenCalledTimes(2);
});

test("clears all listeners", () => {
  const viewChanges = createViewChangeListeners();
  const listener = jest.fn();
  viewChanges.subscribe(listener);
  viewChanges.clear();
  viewChanges.emit();
  expect(listener).toHaveBeenCalledTimes(1);
});
