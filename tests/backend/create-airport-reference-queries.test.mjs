import { expect, jest, test } from "@jest/globals";
import { createAirportReferenceQueries } from "../../src/backend/create-airport-reference-queries.mjs";

function makeQueries({ airports = [], runways = [], navaids = [] } = {}) {
  const airportStatement = { all: jest.fn(() => airports) };
  const runwayStatement = { all: jest.fn(() => runways) };
  const navaidStatement = { all: jest.fn(() => navaids) };
  const database = {
    prepare: jest
      .fn()
      .mockReturnValueOnce(airportStatement)
      .mockReturnValueOnce(runwayStatement)
      .mockReturnValueOnce(navaidStatement),
  };
  return {
    queries: createAirportReferenceQueries(database),
    airportStatement,
    runwayStatement,
    navaidStatement,
  };
}

test("maps in-range airports with only valid runway pairs", () => {
  const { queries, airportStatement, runwayStatement } = makeQueries({
    airports: [
      { faaId: "PWM", icao: "KPWM", latitude: 43.6, longitude: -70.3 },
      { faaId: "BAD", latitude: Number.NaN, longitude: -70.3 },
      { faaId: "FAR", latitude: 45, longitude: -70 },
    ],
    runways: [
      { runwayId: "09/27", latitude: 43, longitude: -70, alignmentDegrees: 90 },
      { runwayId: "09/27", latitude: 43.1, longitude: -70, alignmentDegrees: 270 },
      { runwayId: "03/21", latitude: 43, longitude: -70, alignmentDegrees: Number.NaN },
      { runwayId: "INVALID", latitude: Number.NaN, longitude: -70, alignmentDegrees: 1 },
    ],
  });
  const result = queries.findBetween({ latitude: 43.6, longitude: -70.3 }, 0, 20);
  expect(airportStatement.all).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
  );
  expect(result).toHaveLength(1);
  expect(result[0].icao).toBe("KPWM");
  expect(result[0].runways).toHaveLength(1);
  expect(runwayStatement.all).toHaveBeenCalledWith("PWM");
});

test("maps valid navaids and applies the open lower range bound", () => {
  const { queries, navaidStatement } = makeQueries({
    navaids: [
      { identifier: "HOME", latitude: 0, longitude: 0 },
      { identifier: "EDGE", latitude: 0.1, longitude: 0 },
      { identifier: "BAD", latitude: 0, longitude: Number.NaN },
    ],
  });
  const result = queries.findNavaidsBetween({ latitude: 0, longitude: 0 }, 5, 20);
  expect(result.map((item) => item.identifier)).toEqual(["EDGE"]);
  expect(navaidStatement.all).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
  );
});

test("clamps range bounds at the poles and date line", () => {
  const { queries, airportStatement, navaidStatement } = makeQueries();
  queries.findBetween({ latitude: 90, longitude: 180 }, 0, 300);
  expect(airportStatement.all).toHaveBeenLastCalledWith(85, 90, -180, 180);
  queries.findNavaidsBetween({ latitude: -90, longitude: -180 }, 0, 300);
  expect(navaidStatement.all).toHaveBeenLastCalledWith(-90, -85, -180, 180);
});
