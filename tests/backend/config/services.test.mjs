import { expect, jest, test } from "@jest/globals";
import { resolveWebServiceConfiguration } from "../../../src/backend/config/services.mjs";

test("resolves NASR, METAR, and logging settings", () => {
  const parseMetarStations = jest.fn((value) => value.split(","));
  expect(
    resolveWebServiceConfiguration(
      {
        NASR_DATABASE_PATH: "nasr.sqlite",
        METAR_STATIONS: "KLEW,KPWM",
        LOG_LEVEL: "debug",
      },
      parseMetarStations,
    ),
  ).toEqual({
    airportDatabasePath: "nasr.sqlite",
    metarStations: ["KLEW", "KPWM"],
    logLevel: "debug",
  });
  expect(parseMetarStations).toHaveBeenCalledWith("KLEW,KPWM");
});
