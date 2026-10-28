import { expect, test } from "@jest/globals";
import { splitSbsRecordFields } from "../../../../src/shared/sbs/record/fields.mjs";

test("splits SBS records into fields", () => {
  expect(splitSbsRecordFields("MSG,3,1,1,ABC123")).toEqual(["MSG", "3", "1", "1", "ABC123"]);
});

test("preserves empty fields while splitting", () => {
  expect(splitSbsRecordFields("MSG,,1,")).toEqual(["MSG", "", "1", ""]);
});
