import { expect, jest, test } from "@jest/globals";
import { resolveWebServiceConfiguration } from "../../../src/backend/config/services.mjs";

test("resolves NASR, METAR, logging, and ADSB.lol polling settings", () => {
  const parseMetarStations = jest.fn((value) => value.split(","));
  expect(
    resolveWebServiceConfiguration(
      {
        NASR_DATABASE_PATH: "nasr.sqlite",
        METAR_STATIONS: "KLEW,KPWM",
        LOG_LEVEL: "debug",
        ADSBLOL_POLL_INTERVAL_MS: "45000",
      },
      parseMetarStations,
    ),
  ).toEqual({
    airportDatabasePath: "nasr.sqlite",
    metarStations: ["KLEW", "KPWM"],
    logLevel: "debug",
    adsbLolPollIntervalMs: 45000,
  });
  expect(parseMetarStations).toHaveBeenCalledWith("KLEW,KPWM");
});

test("uses the default ADSB.lol polling interval", () => {
  expect(resolveWebServiceConfiguration({}, () => []).adsbLolPollIntervalMs).toBe(15000);
});

test("rejects an invalid ADSB.lol polling interval", () => {
  expect(() =>
    resolveWebServiceConfiguration({ ADSBLOL_POLL_INTERVAL_MS: "500" }, () => []),
  ).toThrow("ADSBLOL_POLL_INTERVAL_MS must be an integer from 1000 through 300000");
});
