import { expect, jest, test } from "@jest/globals";
import { createAirportReferenceQuery } from "../../../src/backend/airport/reference-query.mjs";

function createQuery({ airports = [], runways = [] } = {}) {
  const airportStatement = { all: jest.fn(() => airports) };
  const runwayStatement = { all: jest.fn(() => runways) };
  const database = {
    prepare: jest.fn().mockReturnValueOnce(airportStatement).mockReturnValueOnce(runwayStatement),
  };
  return { query: createAirportReferenceQuery(database), airportStatement, runwayStatement };
}

test("maps in-range airports with only valid runway pairs", () => {
  const { query, airportStatement, runwayStatement } = createQuery({
    airports: [
      { faaId: "PWM", icao: "KPWM", latitude: 43.6, longitude: -70.3 },
      { faaId: "BAD", latitude: Number.NaN, longitude: -70.3 },
      { faaId: "FAR", latitude: 45, longitude: -70 },
    ],
    runways: [
      { airportId: "PWM", runwayId: "09/27", latitude: 43, longitude: -70, alignmentDegrees: 90 },
      {
        airportId: "PWM",
        runwayId: "09/27",
        latitude: 43.1,
        longitude: -70,
        alignmentDegrees: 270,
      },
      {
        airportId: "PWM",
        runwayId: "03/21",
        latitude: 43,
        longitude: -70,
        alignmentDegrees: Number.NaN,
      },
      {
        airportId: "PWM",
        runwayId: "INVALID",
        latitude: Number.NaN,
        longitude: -70,
        alignmentDegrees: 1,
      },
    ],
  });
  const result = query({ latitude: 43.6, longitude: -70.3 }, 0, 20);
  expect(airportStatement.all).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
  );
  expect(result).toHaveLength(1);
  expect(result[0].icao).toBe("KPWM");
  expect(result[0].runways).toHaveLength(1);
  expect(runwayStatement.all).toHaveBeenCalledWith('["PWM"]');
});

test("fetches runway ends once and groups them by airport for a multi-airport range", () => {
  const { query, runwayStatement } = createQuery({
    airports: [
      { faaId: "PWM", latitude: 43.6, longitude: -70.3 },
      { faaId: "BID", latitude: 43.7, longitude: -70.2 },
      { faaId: "LEW", latitude: 43.6, longitude: -70.3 },
    ],
    runways: [
      { airportId: "PWM", runwayId: "09/27", latitude: 43, longitude: -70, alignmentDegrees: 90 },
      {
        airportId: "PWM",
        runwayId: "09/27",
        latitude: 43.1,
        longitude: -70,
        alignmentDegrees: 270,
      },
      {
        airportId: "BID",
        runwayId: "12/30",
        latitude: 43.7,
        longitude: -70.2,
        alignmentDegrees: 120,
      },
      {
        airportId: "BID",
        runwayId: "12/30",
        latitude: 43.8,
        longitude: -70.1,
        alignmentDegrees: 300,
      },
    ],
  });
  const result = query({ latitude: 43.6, longitude: -70.3 }, 0, 20);
  expect(runwayStatement.all).toHaveBeenCalledTimes(1);
  expect(runwayStatement.all).toHaveBeenCalledWith('["PWM","BID","LEW"]');
  expect(result.slice(0, 2).map(({ faaId, runways }) => [faaId, runways[0][0].runwayId])).toEqual([
    ["PWM", "09/27"],
    ["BID", "12/30"],
  ]);
  expect(result[2].runways).toEqual([]);
});

test("returns early without fetching runway ends when no airports are in range", () => {
  const { query, runwayStatement } = createQuery();
  expect(query({ latitude: 43, longitude: -70 }, 0, 20)).toEqual([]);
  expect(runwayStatement.all).not.toHaveBeenCalled();
});
