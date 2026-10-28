import { expect, test } from "@jest/globals";
import {
  formatMetarReportRow,
  formatMetarTableHeaders,
} from "../../../../src/frontend/metar/table/formatting.mjs";

const decoded = {
  automated: true,
  observed: "13 16:41Z",
  windDirection: "180°",
  windSpeed: "6",
  flightCategory: "VFR",
  visibility: "4",
  conditions: "RA",
  clouds: "BKN012",
  temperature: "70°F",
  dewPoint: "65°F",
  altimeter: "30.01",
};

test("formats METAR table headers", () => {
  const headers = formatMetarTableHeaders();
  expect(headers).toContain('<th class="metar-age-header">AGE</th>');
  expect(headers).toContain('<th class="metar-wind-header" colspan="2">WIND</th>');
  expect(headers).toContain('<th class="metar-sky-header">SKY</th>');
});

test("formats decoded METAR values with category, age, weather, and field classes", () => {
  const row = formatMetarReportRow(
    { id: "KLEW", metar: "02004KT", decoded },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(row).toContain("<td>A</td><td>KLEW</td>");
  expect(row).toContain("flight-category-vfr");
  expect(row).toContain('class="metar-weather"');
  expect(row).toContain('class="metar-visibility"');
  expect(row).toContain('class="metar-sky"');
});

test("formats undecoded reports and escapes raw report text", () => {
  expect(
    formatMetarReportRow({ id: "KPWM", metar: "bad <data>", decoded: null }, new Date(0)),
  ).toBe('<tr><td></td><th>KPWM</th><td>—</td><td colspan="9">bad &lt;data&gt;</td></tr>');
});

test("formats missing decoded values and non-default flight categories", () => {
  const row = ["MVFR", "IFR", "LIFR"]
    .map((flightCategory) =>
      formatMetarReportRow({ id: "KXXX", metar: "raw", decoded: { flightCategory } }),
    )
    .join("");
  expect(row).toContain("flight-category-mvfr");
  expect(row).toContain("flight-category-ifr");
  expect(row).toContain("flight-category-lifr");
  expect(
    formatMetarReportRow({ id: "KBXM", metar: "raw", decoded: { observed: null } }, new Date(0)),
  ).toContain("<td>KBXM</td><td>—</td>");
});
