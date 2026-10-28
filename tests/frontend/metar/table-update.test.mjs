import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../../src/frontend/metar/table-update.mjs";

test("uses the supplied current time", () => {
  const element = { innerHTML: "" };
  updateMetarDisplay(
    element,
    { reports: [{ id: "KPWM", metar: "raw", decoded: null }] },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(element.innerHTML).toContain("KPWM");
});
