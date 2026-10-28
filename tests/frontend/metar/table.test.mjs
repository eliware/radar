import { expect, test } from "@jest/globals";
import { renderMetarTable } from "../../../src/frontend/metar/table.mjs";

test("wraps formatted METAR rows in a table", () => {
  const markup = renderMetarTable([{ id: "KPWM", metar: "raw", decoded: null }]);
  expect(markup.startsWith("<table><thead><tr>")).toBe(true);
  expect(markup.endsWith("</tbody></table>")).toBe(true);
  expect(markup).toContain("KPWM");
});
