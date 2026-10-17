import { expect, jest, test } from "@jest/globals";
import { registerMetarRoutes } from "../../src/backend/metar-routes.mjs";

test("returns configured stations and current reports", async () => {
  const routes = new Map();
  const reports = [{ id: "KPWM", metar: "131651Z 29012KT 10SM FEW045 18/07 A2992" }];
  const lookup = { stations: ["KPWM"], get: jest.fn(async () => reports) };
  registerMetarRoutes({ get: (path, handler) => routes.set(path, handler) }, lookup);
  expect(await routes.get("/api/metar")()).toEqual({
    stations: ["KPWM"],
    reports: [
      {
        ...reports[0],
        decoded: {
          automated: false,
          observed: "13 16:51Z",
          windDirection: "290°",
          windSpeed: "12",
          visibility: "10",
          flightCategory: "VFR",
          conditions: "—",
          clouds: "FEW045",
          temperature: "64°F",
          dewPoint: "45°F",
          altimeter: "29.92",
        },
      },
    ],
  });
  expect(lookup.get).toHaveBeenCalledTimes(1);
});

test("returns a gateway error when the METAR service fails", async () => {
  const routes = new Map();
  const lookup = {
    stations: ["KPWM"],
    get: jest.fn(async () => {
      throw new Error("offline");
    }),
  };
  registerMetarRoutes({ get: (path, handler) => routes.set(path, handler) }, lookup);
  const reply = { code: jest.fn(() => reply), send: jest.fn((data) => data) };
  expect(await routes.get("/api/metar")({}, reply)).toEqual({
    error: "VATSIM METAR data is not available.",
  });
  expect(reply.code).toHaveBeenCalledWith(502);
});
