import { expect, jest, test } from "@jest/globals";
import { createAirportDatabase } from "../../src/backend/airport-database.mjs";

test("opens SQLite in read-only mode and filters airport rows by distance band", () => {
  const airportStatement = {
    all: jest.fn(() => [
      { faaId: "PWM", icao: "KPWM", latitude: 43.6, longitude: -70.3, elevationFeet: 76 },
      { faaId: "BGR", icao: "KBGR", latitude: 44.8, longitude: -68.8, elevationFeet: 192 },
      { faaId: "BAD-LAT", latitude: Number.NaN, longitude: -70 },
      { faaId: "BAD-LON", latitude: 43.6, longitude: Number.NaN },
    ]),
  };
  const runwayStatement = {
    all: jest.fn(() => [
      {
        runwayId: "09/27",
        endId: "09",
        latitude: 43,
        longitude: -70,
        elevationFeet: 80,
        alignmentDegrees: 90,
      },
      {
        runwayId: "09/27",
        endId: "27",
        latitude: 43.1,
        longitude: -70,
        elevationFeet: 76,
        alignmentDegrees: 270,
      },
      { runwayId: "03/21", latitude: 43, longitude: -70, alignmentDegrees: 30 },
      { runwayId: "BAD-LAT", latitude: Number.NaN, longitude: -70, alignmentDegrees: 30 },
      { runwayId: "BAD-LON", latitude: 43, longitude: Number.NaN, alignmentDegrees: 30 },
      { runwayId: "BAD-ALIGN", latitude: 43, longitude: -70, alignmentDegrees: Number.NaN },
    ]),
  };
  const navaidStatement = {
    all: jest.fn(() => [
      {
        identifier: "ENE",
        type: "VOR/DME",
        name: "Kennebunk",
        state: "ME",
        latitude: 43.4257,
        longitude: -70.6135,
      },
      { identifier: "BAD", latitude: Number.NaN, longitude: -70 },
      { identifier: "FAR", latitude: 44.8, longitude: -68.8 },
    ]),
  };
  const database = {
    prepare: jest.fn((sql) => {
      if (sql.includes("A.FACILITY_USE_CODE")) {
        expect(sql).toContain("A.FACILITY_USE_CODE = 'PU'");
        expect(sql).toContain("A.ICAO_ID GLOB 'K[A-Z0-9][A-Z0-9][A-Z0-9]'");
        expect(sql).toContain("R.SURFACE_TYPE_CODE IN ('ASPH', 'CONC'");
        expect(sql).toContain("R.RWY_LEN AS REAL) > 1000");
      }
      if (sql.includes("APT_RWY_END")) return runwayStatement;
      if (sql.includes("NAV_BASE")) return navaidStatement;
      return airportStatement;
    }),
    close: jest.fn(),
  };
  const Database = jest.fn(() => database);
  const repository = createAirportDatabase("nasr.sqlite", { Database, exists: () => true });
  const result = repository.findBetween({ latitude: 43.6, longitude: -70.3 }, 0, 20);
  expect(Database).toHaveBeenCalledWith(expect.stringContaining("nasr.sqlite"), { readOnly: true });
  expect(airportStatement.all).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
  );
  expect(runwayStatement.all).toHaveBeenCalledWith("PWM");
  expect(result.map((airport) => airport.icao)).toEqual(["KPWM"]);
  expect(result[0].runways).toHaveLength(1);
  expect(result[0].runways[0]).toHaveLength(2);
  expect(result[0].runways[0].map((end) => end.elevationFeet)).toEqual([80, 76]);
  expect(result[0].rangeNm).toBeCloseTo(0, 2);
  expect(database.prepare.mock.calls.find(([sql]) => sql.includes("APT_RWY_END"))[0]).toContain(
    "R.SURFACE_TYPE_CODE IN ('ASPH', 'CONC'",
  );
  const navaids = repository.findNavaidsBetween({ latitude: 43.6, longitude: -70.3 }, 0, 20);
  expect(navaids).toHaveLength(1);
  expect(navaids[0]).toMatchObject({ identifier: "ENE", type: "VOR/DME" });
  repository.close();
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("keeps an unconfigured database optional and rejects a missing configured path", () => {
  expect(createAirportDatabase(undefined, { exists: () => false })).toBeNull();
  expect(() => createAirportDatabase("missing.sqlite", { exists: () => false })).toThrow(
    "NASR database file not found",
  );
  expect(() => createAirportDatabase("missing-default-path.sqlite")).toThrow(
    "NASR database file not found",
  );
});

test("clamps search bounds at the poles and date line", () => {
  const airportStatement = { all: jest.fn(() => []) };
  const database = {
    prepare: jest.fn(() => airportStatement),
    close: jest.fn(),
  };
  const repository = createAirportDatabase("", {
    Database: jest.fn(() => database),
    exists: () => true,
  });

  repository.findBetween({ latitude: 90, longitude: 180 }, 0, 300);
  expect(airportStatement.all).toHaveBeenLastCalledWith(85, 90, -180, 180);
  repository.findBetween({ latitude: -90, longitude: -180 }, 0, 300);
  expect(airportStatement.all).toHaveBeenLastCalledWith(-90, -85, -180, 180);
  repository.close();
});

test("keeps records above the lower edge of a distance band", () => {
  const airportStatement = {
    all: jest.fn(() => [
      { faaId: "NEAR", latitude: 0.05, longitude: 0 },
      { faaId: "IN", latitude: 0.1, longitude: 0 },
    ]),
  };
  const database = {
    prepare: jest.fn(() => airportStatement),
    close: jest.fn(),
  };
  const repository = createAirportDatabase("band.sqlite", {
    Database: jest.fn(() => database),
    exists: () => true,
  });

  expect(
    repository.findBetween({ latitude: 0, longitude: 0 }, 5, 20).map((item) => item.faaId),
  ).toEqual(["IN"]);
  repository.close();
});
