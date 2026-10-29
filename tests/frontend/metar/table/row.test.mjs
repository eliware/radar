import { expect, test } from "@jest/globals";
import { renderMetarTableRow } from "../../../../src/frontend/metar/table/row.mjs";

test("renders and escapes an undecoded report row", () => {
  expect(renderMetarTableRow({ id: "K<XX>", metar: "bad <data>", decoded: null })).toContain(
    'K&lt;XX&gt;</th><td>—</td><td colspan="9">bad &lt;data&gt;',
  );
});

test("renders decoded values with their category and age classes", () => {
  const row = renderMetarTableRow(
    {
      id: "KLEW",
      metar: "raw",
      decoded: {
        observed: "13 16:41Z",
        flightCategory: "VFR",
        visibility: "4",
        clouds: "BKN012",
      },
    },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(row).toContain("flight-category-vfr");
  expect(row).toContain('class="metar-age');
  expect(row).toContain('class="metar-visibility"');
  expect(row).toContain('class="metar-sky"');
});
