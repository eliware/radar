import { expect, test } from "@jest/globals";
import { decodedFields } from "../../../src/backend/metar/format-fields.mjs";

test("formats parsed METAR fields for display", () => {
  expect(
    decodedFields({
      auto: true,
      day: 3,
      hour: 4,
      minute: 5,
      wind: { degrees: 5, speed: 10, gust: 15 },
      visibility: { indicator: ">", value: 6 },
      weatherConditions: [{ intensity: "-", descriptive: "", phenomenons: ["RA"] }],
      clouds: [{ quantity: "BKN", height: 1500, type: "CB" }],
      temperature: 10,
      dewPoint: 5,
      altimeter: { value: 29.9 },
    }),
  ).toEqual({
    automated: true,
    observed: "03 04:05Z",
    windDirection: "005°",
    windSpeed: "10G15",
    visibility: ">6",
    flightCategory: "MVFR",
    conditions: "-RA",
    clouds: "BKN015CB",
    temperature: "50°F",
    dewPoint: "41°F",
    altimeter: "29.90",
  });
});

test("formats missing, variable, vertical visibility, and CAVOK fields", () => {
  expect(
    decodedFields({
      day: 1,
      hour: 2,
      minute: 3,
      wind: { direction: "VRB", speed: 4 },
      verticalVisibility: 200,
      visibility: null,
      weatherConditions: [],
      clouds: [],
      cavok: true,
    }),
  ).toEqual(
    expect.objectContaining({
      observed: "01 02:03Z",
      windDirection: "VRB",
      windSpeed: "4",
      visibility: "VV 200 ft",
      clouds: "Vertical visibility",
      temperature: "—",
      dewPoint: "—",
    }),
  );
  expect(decodedFields({ weatherConditions: [], clouds: [], cavok: true }).clouds).toBe("CAVOK");
  expect(decodedFields({ weatherConditions: [], clouds: [] }).observed).toBe("—");
});
