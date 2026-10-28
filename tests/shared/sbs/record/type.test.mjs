import { expect, test } from "@jest/globals";
import { isSupportedSbsRecordType } from "../../../../src/shared/sbs/record/type.mjs";

test.each(["MSG", "STA", "ID", "AIR", "SEL", "CLK"])("accepts record type %s", (type) => {
  expect(isSupportedSbsRecordType(type)).toBe(true);
});

test.each(["", "OTHER", "msg", null])("rejects unsupported record type %s", (type) => {
  expect(isSupportedSbsRecordType(type)).toBe(false);
});
