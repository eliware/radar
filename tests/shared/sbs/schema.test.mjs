import { expect, test } from "@jest/globals";
import { SBS_FIELD_NAMES, SBS_NUMERIC_FIELDS } from "../../../src/shared/sbs/schema.mjs";

test("defines the SBS field order and numeric conversion fields", () => {
  expect(SBS_FIELD_NAMES).toHaveLength(22);
  expect(SBS_FIELD_NAMES[0]).toBe("recordType");
  expect(SBS_FIELD_NAMES[4]).toBe("icao");
  expect(SBS_FIELD_NAMES.at(-1)).toBe("onGround");
  expect(SBS_NUMERIC_FIELDS.has("latitude")).toBe(true);
  expect(SBS_NUMERIC_FIELDS.has("callsign")).toBe(false);
});
