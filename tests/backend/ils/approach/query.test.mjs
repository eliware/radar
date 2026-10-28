import { expect, jest, test } from "@jest/globals";
import { createIlsApproachQuery } from "../../../../src/backend/ils/approach/query.mjs";
import { ILS_APPROACH_QUERY, ILS_MARKER_QUERY } from "../../../../src/backend/ils/approach/sql.mjs";

test("prepares both query statements and runs them with geographic bounds", () => {
  const statement = { all: jest.fn(() => []) };
  const markerStatement = { all: jest.fn(() => []) };
  const database = {
    prepare: jest.fn((query) => (query === ILS_MARKER_QUERY ? markerStatement : statement)),
  };
  const find = createIlsApproachQuery(database);
  expect(find({ latitude: 43, longitude: -70 }, 0, 20)).toEqual([]);
  expect(database.prepare).toHaveBeenNthCalledWith(1, ILS_APPROACH_QUERY);
  expect(database.prepare).toHaveBeenNthCalledWith(2, ILS_MARKER_QUERY);
  expect(markerStatement.all).toHaveBeenCalledWith(
    expect.closeTo(43 - 20 / 60),
    expect.closeTo(43 + 20 / 60),
    expect.closeTo(-70 - 20 / (60 * Math.cos((43 * Math.PI) / 180))),
    expect.closeTo(-70 + 20 / (60 * Math.cos((43 * Math.PI) / 180))),
  );
  expect(statement.all).toHaveBeenCalledWith(
    expect.closeTo(43 - 20 / 60),
    expect.closeTo(43 + 20 / 60),
    expect.closeTo(-70 - 20 / (60 * Math.cos((43 * Math.PI) / 180))),
    expect.closeTo(-70 + 20 / (60 * Math.cos((43 * Math.PI) / 180))),
  );
});

test("clamps query bounds at the poles and date line", () => {
  const statement = { all: jest.fn(() => []) };
  const find = createIlsApproachQuery({ prepare: () => statement });
  find({ latitude: 90, longitude: 180 }, 0, 300);
  expect(statement.all).toHaveBeenLastCalledWith(85, 90, -180, 180);
  find({ latitude: -90, longitude: -180 }, 0, 300);
  expect(statement.all).toHaveBeenLastCalledWith(-90, -85, -180, 180);
});
