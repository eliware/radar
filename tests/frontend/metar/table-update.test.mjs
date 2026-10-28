import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../../src/frontend/metar/table-update.mjs";

test("renders reports and selects the empty state", () => {
  const element = { innerHTML: "", textContent: "" };
  updateMetarDisplay(element, { reports: [{ id: "KPWM", metar: "04006KT", decoded: null }] });
  expect(element.innerHTML).toContain("KPWM");
  updateMetarDisplay(element, { reports: [] });
  expect(element.textContent).toBe("No METAR reports available.");
  updateMetarDisplay(element, {});
  expect(element.textContent).toBe("No METAR reports available.");
  expect(() => updateMetarDisplay(null, { reports: [] })).not.toThrow();
});

test("uses the supplied current time", () => {
  const element = { innerHTML: "" };
  updateMetarDisplay(
    element,
    { reports: [{ id: "KPWM", metar: "raw", decoded: null }] },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(element.innerHTML).toContain("KPWM");
});
