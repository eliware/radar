import { expect, jest, test } from "@jest/globals";
import { decodeMetarReport } from "../../../src/backend/metar/decoder.mjs";

test("decodes a VATSIM report with wind, weather, clouds, and pressure", () => {
  expect(
    decodeMetarReport({
      id: "KPWM",
      metar: "131651Z 29012G18KT 10SM -RA FEW045 BKN080 18/07 A2992",
    }),
  ).toEqual({
    id: "KPWM",
    metar: "131651Z 29012G18KT 10SM -RA FEW045 BKN080 18/07 A2992",
    decoded: {
      automated: false,
      observed: "13 16:51Z",
      windDirection: "290°",
      windSpeed: "12G18",
      visibility: "10",
      flightCategory: "VFR",
      conditions: "-RA",
      clouds: "FEW045 BKN080",
      temperature: "64°F",
      dewPoint: "45°F",
      altimeter: "29.92",
    },
  });
});

test("decodes variable wind, vertical visibility, and negative temperatures", () => {
  const result = decodeMetarReport({
    id: "KLEW",
    metar: "METAR KLEW 131651Z VRB03KT 1/2SM FG VV002 M02/M04 A2988",
  });
  expect(result.decoded).toEqual({
    automated: false,
    observed: "13 16:51Z",
    windDirection: "VRB",
    windSpeed: "3",
    visibility: "VV 200 ft",
    flightCategory: "LIFR",
    conditions: "FG",
    clouds: "Vertical visibility",
    temperature: "28°F",
    dewPoint: "25°F",
    altimeter: "29.88",
  });
});

test("keeps report time when weather fields are missing", () => {
  const result = decodeMetarReport({ id: "KBXM", metar: "METAR KBXM 131651Z /////KT" });
  expect(result.decoded).toEqual({
    automated: false,
    observed: "13 16:51Z",
    windDirection: "—",
    windSpeed: "—",
    visibility: "—",
    flightCategory: null,
    conditions: "—",
    clouds: "—",
    temperature: "—",
    dewPoint: "—",
    altimeter: "—",
  });
});

test("returns null decoded data for invalid input and failed text conversion", () => {
  expect(decodeMetarReport({ id: "KPWM", metar: "bad report" }).decoded).toBeNull();
  expect(decodeMetarReport({ id: "KPWM", metar: null }).decoded).toBeNull();
  const badText = {
    toString: () => {
      throw new Error("bad text");
    },
  };
  expect(decodeMetarReport({ id: "KPWM", metar: badText }).decoded).toBeNull();
});

test("formats optional cloud and temperature values", () => {
  const parse = jest.fn(() => ({
    day: 13,
    hour: 16,
    minute: 51,
    wind: { direction: "VRB", speed: 3, unit: "KT" },
    visibility: { value: 10, unit: "SM" },
    weatherConditions: [],
    clouds: [{ quantity: "BKN" }],
    temperature: 18,
    altimeter: undefined,
  }));
  const result = decodeMetarReport({ id: "KPWM", metar: "raw" }, parse);
  expect(result.decoded).toEqual({
    automated: false,
    observed: "13 16:51Z",
    windDirection: "VRB",
    windSpeed: "3",
    visibility: "10",
    flightCategory: "VFR",
    conditions: "—",
    clouds: "BKN—",
    temperature: "64°F",
    dewPoint: "—",
    altimeter: "—",
  });
  const missingTemperature = decodeMetarReport(
    { id: "KPWM", metar: "raw" },
    jest.fn(() => ({
      weatherConditions: [],
      clouds: [],
      temperature: undefined,
      dewPoint: 8,
    })),
  );
  expect(missingTemperature.decoded.temperature).toBe("—");
  expect(missingTemperature.decoded.dewPoint).toBe("46°F");
});

test("exposes the METAR AUTO modifier", () => {
  const result = decodeMetarReport({
    id: "KPWM",
    metar: "METAR KPWM 132051Z AUTO 10006KT 10SM CLR 11/10 A3000",
  });
  expect(result.decoded.automated).toBe(true);
});

test("shows CAVOK when the report has no visibility or cloud groups", () => {
  const parse = jest.fn(() => ({
    weatherConditions: [],
    clouds: [],
    cavok: true,
  }));
  const result = decodeMetarReport({ id: "KPWM", metar: "raw" }, parse);
  expect(result.decoded.visibility).toBe("—");
  expect(result.decoded.flightCategory).toBe("VFR");
  expect(result.decoded.clouds).toBe("CAVOK");
});
