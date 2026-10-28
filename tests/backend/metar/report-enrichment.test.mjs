import { expect, test } from "@jest/globals";
import { enrichMetarReport } from "../../../src/backend/metar/report-enrichment.mjs";

test("retains useful decoded fields on the original report", () => {
  const report = { id: "KPWM", metar: "raw" };
  const decoded = { observed: "13 16:51Z", windSpeed: "12" };
  expect(enrichMetarReport(report, decoded)).toEqual({ ...report, decoded });
});

test("uses null when decoded fields have no useful values", () => {
  const report = { id: "KPWM", metar: "raw" };
  expect(enrichMetarReport(report, { observed: "—", windSpeed: "—" })).toEqual({
    ...report,
    decoded: null,
  });
  expect(enrichMetarReport(report, null)).toEqual({ ...report, decoded: null });
});
