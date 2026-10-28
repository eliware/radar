import { expect, test } from "@jest/globals";
import { formatMetarTableHeaders } from "../../../../src/frontend/metar/table/headers.mjs";

test("formats METAR table headers", () => {
  const headers = formatMetarTableHeaders();
  expect(headers).toContain('<th class="metar-age-header">AGE</th>');
  expect(headers).toContain('<th class="metar-wind-header" colspan="2">WIND</th>');
  expect(headers).toContain('<th class="metar-sky-header">SKY</th>');
});
