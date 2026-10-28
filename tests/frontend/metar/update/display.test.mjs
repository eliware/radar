import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../../../src/frontend/metar/update/display.mjs";

test("updates a METAR display with the coordinated table renderer", () => {
  const element = { textContent: "", innerHTML: "" };
  updateMetarDisplay(element, { reports: [{ id: "KPWM", metar: "raw", decoded: null }] });
  expect(element.innerHTML).toContain("<table>");
  expect(element.innerHTML).toContain("KPWM");
});
