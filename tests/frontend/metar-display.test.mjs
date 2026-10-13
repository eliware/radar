import { expect, test } from "@jest/globals";
import { formatAge, updateMetarDisplay } from "../../src/frontend/metar-display.mjs";

function nodes() {
  return [{ textContent: "", innerHTML: "" }, { textContent: "" }];
}

const decoded = {
  automated: true,
  observed: "13 16:51Z",
  windDirection: "290°",
  windSpeed: "12G18",
  visibility: "10",
  conditions: "-RA",
  clouds: "FEW 4500 SCT 25000",
  temperature: "64°F",
  dewPoint: "45°F",
  altimeter: "29.92",
};

test("renders decoded METAR rows and builds a mobile ticker", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, {
    reports: [
      { id: "KLEW", metar: "02004KT", decoded },
      { id: "KPWM", metar: "04006KT", decoded },
    ],
  });
  expect(panel.innerHTML).toContain('<th class="metar-age-header">AGE</th>');
  expect(panel.innerHTML).toContain('<th class="metar-wind-header" colspan="2">WIND</th>');
  expect(panel.innerHTML).toContain('<th class="metar-wx-header">WX</th>');
  expect(panel.innerHTML).toContain('<th class="metar-sky-header">SKY</th>');
  expect(panel.innerHTML).toContain("<th>TMP</th><th>DEW</th>");
  expect(panel.innerHTML).toContain("<td>A</td><td>KLEW</td>");
  expect(panel.innerHTML).toMatch(
    /<td>KLEW<\/td><td>\d+(?:h\d*m?|m)<\/td><td>290°<\/td><td>12G18<\/td>/,
  );
  expect(panel.innerHTML).toContain('<td class="metar-weather">-RA</td>');
  expect(panel.innerHTML.match(/<tr>/g)).toHaveLength(3);
  expect(ticker.textContent).toBe("KLEW 02004KT　•　KPWM 04006KT");
});

test("shows raw METAR text when the parser cannot decode a report", () => {
  const [panel] = nodes();
  updateMetarDisplay(panel, nodes()[1], {
    reports: [{ id: "KPWM", metar: "bad <data>", decoded: null }],
  });
  expect(panel.innerHTML).toContain('<td></td><th>KPWM</th><td colspan="9">bad &lt;data&gt;</td>');
});

test("shows an empty report message and ignores missing display nodes", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, { reports: [] });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe(panel.textContent);
  expect(() => updateMetarDisplay(null, ticker, {})).not.toThrow();
  expect(() => updateMetarDisplay(panel, null, {})).not.toThrow();
  expect(() => updateMetarDisplay(panel, ticker, {})).not.toThrow();
});
test("renders placeholders for missing decoded values", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, {
    reports: [{ id: "KBXM", metar: "raw", decoded: { observed: null } }],
  });
  expect(panel.innerHTML).toContain("<td>KBXM</td><td>—</td>");
});

test("formats METAR report age in minutes or hours and minutes", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(formatAge("13 17:50Z", now)).toBe("10m");
  expect(formatAge("13 16:50Z", now)).toBe("1h10m");
  expect(formatAge("12 23:00Z", now)).toBe("19h");
  expect(formatAge("30 23:00Z", new Date("2026-10-01T00:10:00Z"))).toBe("1h10m");
  expect(formatAge("31 23:00Z", new Date("2026-01-01T00:10:00Z"))).toBe("1h10m");
  expect(formatAge("13 23:00Z", now)).toBe("0m");
  expect(formatAge("bad", now)).toBe("—");
});
