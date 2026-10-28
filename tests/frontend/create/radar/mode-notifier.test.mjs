import { expect, jest, test } from "@jest/globals";
import { notifyRadarViewMode } from "../../../../src/frontend/create/radar/mode-notifier.mjs";

test("notifies callers of the selected radar view mode", () => {
  const onMode = jest.fn();
  notifyRadarViewMode(onMode, "3D");
  expect(onMode).toHaveBeenCalledWith("3D");
});

test("supports an omitted mode callback", () => {
  expect(() => notifyRadarViewMode(undefined, "2D")).not.toThrow();
});
