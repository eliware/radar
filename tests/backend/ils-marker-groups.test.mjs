import { expect, test } from "@jest/globals";
import { createIlsMarkerIndex, ilsSystemKey } from "../../src/backend/ils-marker-groups.mjs";

const marker = (overrides = {}) => ({
  faaId: "PWM",
  runwayEnd: "11",
  identifier: "PWM",
  systemType: "LD",
  latitude: 43,
  longitude: -70,
  ...overrides,
});

test("groups valid marker records by ILS system and adds distance", () => {
  const rows = [
    marker({ componentType: "IM" }),
    marker({ componentType: "OM" }),
    marker({ runwayEnd: "29" }),
  ];
  const index = createIlsMarkerIndex(rows, { latitude: 43, longitude: -70 });
  expect(index.get(ilsSystemKey(rows[0]))).toEqual([
    expect.objectContaining({ componentType: "IM", rangeNm: 0 }),
    expect.objectContaining({ componentType: "OM", rangeNm: 0 }),
  ]);
  expect(index.size).toBe(2);
});

test("skips marker records with invalid coordinates", () => {
  const index = createIlsMarkerIndex(
    [marker({ latitude: Number.NaN }), marker({ longitude: Number.NaN })],
    { latitude: 43, longitude: -70 },
  );
  expect(index.size).toBe(0);
});
