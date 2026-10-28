import { expect, test } from "@jest/globals";
import { parseSbsRecord } from "../../../src/shared/sbs/record.mjs";

test("splits supported SBS records into fields", () => {
  expect(parseSbsRecord("MSG,3,1,1,ABC123")).toEqual(["MSG", "3", "1", "1", "ABC123"]);
});

test("rejects unsupported and empty record types", () => {
  expect(parseSbsRecord("OTHER,9,1,1,ABC123")).toBeNull();
  expect(parseSbsRecord("")).toBeNull();
});
