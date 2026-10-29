import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../../../src/frontend/metar/update/display.mjs";

test("updates a METAR display with the coordinated table renderer", () => {
  const element = { textContent: "", innerHTML: "" };
  updateMetarDisplay(element, { reports: [{ id: "KPWM", metar: "raw", decoded: null }] });
  expect(element.innerHTML).toContain("<table>");
  expect(element.innerHTML).toContain("KPWM");
});

test("renders an empty state for missing reports and ignores a missing element", () => {
  const element = { textContent: "previous" };
  updateMetarDisplay(element, {});
  expect(element.textContent).toBe("No METAR reports available.");
  expect(updateMetarDisplay(null, {})).toBeUndefined();
});
