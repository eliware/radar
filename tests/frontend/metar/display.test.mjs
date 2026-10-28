import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../../src/frontend/metar/display.mjs";

test("shows an empty report message and ignores missing display nodes", () => {
  const panel = { textContent: "", innerHTML: "" };
  updateMetarDisplay(panel, { reports: [] });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(() => updateMetarDisplay(null, {})).not.toThrow();
  expect(() => updateMetarDisplay(panel, {})).not.toThrow();
});

test("delegates nonempty report tables to the table renderer", () => {
  const panel = { textContent: "", innerHTML: "" };
  updateMetarDisplay(panel, { reports: [{ id: "KBXM", metar: "raw", decoded: null }] });
  expect(panel.innerHTML).toContain("<table>");
  expect(panel.innerHTML).toContain("KBXM");
});
