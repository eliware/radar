import { expect, test } from "@jest/globals";
import { REQUIRED_COLUMNS } from "../../../src/backend/nasr/required-columns.mjs";

test("declares required schema columns for every NASR table", () => {
  expect(Object.keys(REQUIRED_COLUMNS)).toHaveLength(15);
  expect(REQUIRED_COLUMNS.APT_BASE.split(" ")).toContain("ICAO_ID");
  expect(REQUIRED_COLUMNS.ILS_GS.split(" ")).toContain("G_S_ANGLE");
});
