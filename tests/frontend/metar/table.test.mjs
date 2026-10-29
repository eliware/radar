import { expect, test } from "@jest/globals";
import { renderMetarTable } from "../../../src/frontend/metar/table.mjs";

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

test("renders table headers and decoded METAR fields", () => {
  const markup = renderMetarTable(
    [{ id: "KLEW", metar: "02004KT", decoded }],
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(markup).toContain('<th class="metar-age-header">AGE</th>');
  expect(markup).toContain('<th class="metar-wind-header" colspan="2">WIND</th>');
  expect(markup).toContain('<th class="metar-sky-header">SKY</th>');
  expect(markup).toContain("<td>A</td><td>KLEW</td>");
  expect(markup).toContain("flight-category-vfr");
  expect(markup).toContain('class="metar-weather"');
  expect(markup).toContain('class="metar-visibility"');
  expect(markup).toContain('class="metar-sky"');
});

test("renders undecoded reports and escapes raw report text", () => {
  const markup = renderMetarTable([{ id: "KPWM", metar: "raw", decoded: null }]);
  expect(markup.startsWith("<table><thead><tr>")).toBe(true);
  expect(markup.endsWith("</tbody></table>")).toBe(true);
  expect(markup).toContain("KPWM");
  expect(renderMetarTable([{ id: "KPWM", metar: "bad <data>", decoded: null }])).toContain(
    "bad &lt;data&gt;",
  );
});

test("handles missing decoded values, categories, and empty reports", () => {
  const markup = renderMetarTable(
    ["MVFR", "IFR", "LIFR"].map((flightCategory) => ({
      id: "KXXX",
      metar: "raw",
      decoded: { flightCategory },
    })),
  );
  expect(markup).toContain("flight-category-mvfr");
  expect(markup).toContain("flight-category-ifr");
  expect(markup).toContain("flight-category-lifr");
  expect(renderMetarTable([{ id: "KBXM", metar: "raw", decoded: { observed: null } }])).toContain(
    "<td>KBXM</td><td>—</td>",
  );
  expect(renderMetarTable([])).toBe("No METAR reports available.");
});
