import { expect, test } from "@jest/globals";
import {
  decodedFields,
  metarCategoryLabel,
  metarFlightCategory,
} from "../../../src/shared/metar/fields.mjs";

test("renders only known flight category labels", () => {
  expect(metarCategoryLabel("IFR")).toBe(
    '<span class="flight-category flight-category-ifr">IFR</span>',
  );
  expect(metarCategoryLabel("unknown")).toBe("—");
});

test("formats parsed METAR display fields", () => {
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
  const values = decodedFields({
    day: 1,
    hour: 2,
    minute: 3,
    wind: { direction: "VRB", speed: 4 },
    verticalVisibility: 200,
    weatherConditions: [],
    clouds: [],
    cavok: true,
  });
  expect(values).toMatchObject({
    observed: "01 02:03Z",
    windDirection: "VRB",
    windSpeed: "4",
    visibility: "VV 200 ft",
    clouds: "Vertical visibility",
    temperature: "—",
    dewPoint: "—",
  });
  expect(decodedFields({ weatherConditions: [], clouds: [], cavok: true }).clouds).toBe("CAVOK");
  expect(decodedFields({ weatherConditions: [], clouds: [] }).observed).toBe("—");
  for (const [degrees, expected] of [
    [5, "005°"],
    [45, "045°"],
    [360, "360°"],
  ]) {
    expect(
      decodedFields({ wind: { degrees }, weatherConditions: [], clouds: [] }).windDirection,
    ).toBe(expected);
  }
});

test("formats optional cloud and temperature values", () => {
  expect(
    decodedFields({
      day: 13,
      hour: 16,
      minute: 51,
      wind: { direction: "VRB", speed: 3 },
      visibility: { value: 10 },
      weatherConditions: [],
      clouds: [{ quantity: "BKN" }],
      temperature: 18,
      dewPoint: 8,
    }),
  ).toMatchObject({
    clouds: "BKN—",
    temperature: "64°F",
    dewPoint: "46°F",
    flightCategory: "VFR",
    altimeter: "—",
  });
});

test.each([
  ["VFR", { visibility: { value: 6 }, clouds: [] }],
  ["MVFR", { visibility: { value: 5 }, clouds: [] }],
  ["IFR", { visibility: { value: 2 }, clouds: [] }],
  ["LIFR", { visibility: { value: 0.5 }, clouds: [] }],
  ["IFR", { clouds: [{ quantity: "OVC", height: 900 }] }],
  ["LIFR", { verticalVisibility: 400, visibility: { value: 10 } }],
  ["VFR", { cavok: true }],
  [null, {}],
])("classifies flight category %s", (expected, data) => {
  expect(metarFlightCategory(data)).toBe(expected);
});
