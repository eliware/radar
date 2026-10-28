import { expect, jest, test } from "@jest/globals";
import { reportRadarViewMode } from "../../../../src/frontend/create/radar/mode-report.mjs";

test("reports the selected radar view mode", () => {
  const onMode = jest.fn();
  reportRadarViewMode(onMode, "3D");
  expect(onMode).toHaveBeenCalledWith("3D");
});

test("supports an omitted mode callback", () => {
  expect(() => reportRadarViewMode(undefined, "2D")).not.toThrow();
});
