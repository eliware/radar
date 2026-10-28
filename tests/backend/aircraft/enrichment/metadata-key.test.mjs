import { expect, test } from "@jest/globals";
import { normalizeAircraftMetadataKey } from "../../../../src/backend/aircraft/enrichment/metadata-key.mjs";

test("normalizes metadata keys", () => {
  expect(normalizeAircraftMetadataKey("  abC123 ")).toBe("ABC123");
  expect(normalizeAircraftMetadataKey(null)).toBe("");
});
