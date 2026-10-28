import { expect, test } from "@jest/globals";
import { mapReferenceInRange } from "../../../../src/backend/reference/range/query.mjs";

test("maps valid references and rejects invalid or out-of-range coordinates", () => {
  const location = { latitude: 0, longitude: 0 };
  expect(mapReferenceInRange({ latitude: 0.1, longitude: 0 }, location, 5, 20).rangeNm).toBeCloseTo(
    6,
  );
  expect(mapReferenceInRange({ latitude: 0, longitude: Number.NaN }, location, 0, 20)).toBeNull();
  expect(mapReferenceInRange({ latitude: 0, longitude: 0 }, location, 5, 20)).toBeNull();
  expect(mapReferenceInRange({ latitude: 1, longitude: 0 }, location, 0, 20)).toBeNull();
});
