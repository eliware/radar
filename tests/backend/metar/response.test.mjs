import { expect, test } from "@jest/globals";
import { createMetarResponse } from "../../../src/backend/metar/response.mjs";

test("decodes reports and retains the configured station list", () => {
  const response = createMetarResponse(
    ["KPWM"],
    [{ id: "KPWM", metar: "131651Z 29012KT 10SM FEW045 18/07 A2992" }],
  );
  expect(response.stations).toEqual(["KPWM"]);
  expect(response.reports).toEqual([
    expect.objectContaining({
      id: "KPWM",
      decoded: expect.objectContaining({ flightCategory: "VFR" }),
    }),
  ]);
});
test("returns an empty report list when the lookup has no reports", () => {
  expect(createMetarResponse(["KPWM"], [])).toEqual({ stations: ["KPWM"], reports: [] });
});
