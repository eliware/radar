import { expect, jest, test } from "@jest/globals";
import {
  createIlsApproachQuery,
  ILS_APPROACH_QUERY,
} from "../../src/backend/ils-approach-query.mjs";

test("selects operational ILS courses and optional glide-slope data", () => {
  expect(ILS_APPROACH_QUERY).toContain("FROM ILS_BASE I LEFT JOIN ILS_GS G");
  expect(ILS_APPROACH_QUERY).toContain("I.COMPONENT_STATUS LIKE 'OPERATIONAL%'");
  expect(ILS_APPROACH_QUERY).toContain("CAST(G.G_S_ANGLE AS REAL) AS glideSlopeDegrees");
});

test("maps operational approaches in a requested distance band", () => {
  const row = {
    faaId: "PWM",
    runwayEnd: "11",
    latitude: 43,
    longitude: -70,
    glideSlopeDegrees: 3,
  };
  const statement = { all: jest.fn(() => [row, { ...row, latitude: Number.NaN }]) };
  const database = { prepare: jest.fn(() => statement) };
  const find = createIlsApproachQuery(database);
  expect(find({ latitude: 43, longitude: -70 }, 0, 20)).toEqual([{ ...row, rangeNm: 0 }]);
  expect(statement.all).toHaveBeenCalledWith(
    expect.closeTo(43 - 20 / 60),
    expect.closeTo(43 + 20 / 60),
    expect.closeTo(-70 - 20 / (60 * Math.cos((43 * Math.PI) / 180))),
    expect.closeTo(-70 + 20 / (60 * Math.cos((43 * Math.PI) / 180))),
  );
});

test("excludes the lower band edge and records beyond the maximum range", () => {
  const statement = {
    all: jest.fn(() => [
      { latitude: 1.1, longitude: 0, runwayEnd: "01" },
      { latitude: 1.5, longitude: 0, runwayEnd: "02" },
    ]),
  };
  const find = createIlsApproachQuery({ prepare: () => statement });
  expect(find({ latitude: 0, longitude: 0 }, 60.05, 80).map(({ runwayEnd }) => runwayEnd)).toEqual([
    "01",
  ]);
});

test("clamps query bounds at the poles and date line", () => {
  const statement = { all: jest.fn(() => []) };
  const find = createIlsApproachQuery({ prepare: () => statement });
  find({ latitude: 90, longitude: 180 }, 0, 300);
  expect(statement.all).toHaveBeenLastCalledWith(85, 90, -180, 180);
  find({ latitude: -90, longitude: -180 }, 0, 300);
  expect(statement.all).toHaveBeenLastCalledWith(-90, -85, -180, 180);
});
