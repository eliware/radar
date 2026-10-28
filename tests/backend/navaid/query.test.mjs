import { expect, jest, test } from "@jest/globals";
import { createNavaidQuery } from "../../../src/backend/navaid/query.mjs";

function createQuery(navaids = []) {
  const statement = { all: jest.fn(() => navaids) };
  return { query: createNavaidQuery({ prepare: jest.fn(() => statement) }), statement };
}

test("maps valid navaids and applies the open lower range bound", () => {
  const { query, statement } = createQuery([
    { identifier: "HOME", latitude: 0, longitude: 0 },
    { identifier: "EDGE", latitude: 0.1, longitude: 0 },
    { identifier: "BAD", latitude: 0, longitude: Number.NaN },
  ]);
  const result = query({ latitude: 0, longitude: 0 }, 5, 20);
  expect(result.map((item) => item.identifier)).toEqual(["EDGE"]);
  expect(statement.all).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
  );
});

test("clamps query bounds at the poles and date line", () => {
  const { query, statement } = createQuery();
  query({ latitude: -90, longitude: -180 }, 0, 300);
  expect(statement.all).toHaveBeenCalledWith(-90, -85, -180, 180);
});
