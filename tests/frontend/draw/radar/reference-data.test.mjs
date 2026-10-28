import { expect, test } from "@jest/globals";
import { radarReferenceData } from "../../../../src/frontend/draw/radar/reference-data.mjs";

test("provides maps for missing reference layers and preserves configured maps", () => {
  const airports = new Map();
  const references = radarReferenceData({ airports, procedures: null });
  expect(references.airports).toBe(airports);
  expect(references.procedures).toEqual(new Map());
  expect(Object.values(references).every((value) => value instanceof Map)).toBe(true);
});
