import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../../src/frontend/metar/display.mjs";

function nodes() {
  return [{ textContent: "", innerHTML: "" }, { textContent: "" }];
}

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

test("renders decoded METAR rows and builds a mobile ticker", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(
    panel,
    ticker,
    {
      reports: [
        { id: "KLEW", metar: "02004KT", decoded },
        { id: "KBXM", metar: "04006KT", decoded },
      ],
    },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(panel.innerHTML).toContain('<th class="metar-age-header">AGE</th>');
  expect(panel.innerHTML).toContain("<th>APT</th><th>FLT</th>");
  expect(panel.innerHTML).toContain('<th class="metar-wind-header" colspan="2">WIND</th>');
  expect(panel.innerHTML).toContain('<th class="metar-wx-header">WX</th>');
  expect(panel.innerHTML).toContain('<th class="metar-sky-header">SKY</th>');
  expect(panel.innerHTML).toContain("<th>TMP</th><th>DEW</th>");
  expect(panel.innerHTML).toContain("<td>A</td><td>KLEW</td>");
  expect(panel.innerHTML).toMatch(
    /<td>KLEW<\/td><td><span class="flight-category flight-category-vfr">VFR<\/span><\/td><td class="metar-age(?: metar-age-old)?">\d+(?:h\d*m?|m)<\/td><td>180°<\/td><td>6<\/td>/,
  );
  expect(panel.innerHTML).toContain('<td class="metar-weather">RA</td>');
  expect(panel.innerHTML).toContain('<td class="metar-age metar-age-old">1h19m</td>');
  expect(panel.innerHTML.match(/<tr>/g)).toHaveLength(3);
});

test("highlights METAR age only after it exceeds one hour", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(
    panel,
    ticker,
    { reports: [{ id: "KBXM", metar: "raw", decoded: { ...decoded, observed: "13 17:00Z" } }] },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(panel.innerHTML).toContain('<td class="metar-age">1h</td>');
  updateMetarDisplay(
    panel,
    ticker,
    { reports: [{ id: "KBXM", metar: "raw", decoded: { ...decoded, observed: "13 16:59Z" } }] },
    new Date("2026-10-13T18:00:00Z"),
  );
  expect(panel.innerHTML).toContain('<td class="metar-age metar-age-old">1h1m</td>');
});

test("shows raw METAR text when the parser cannot decode a report", () => {
  const [panel] = nodes();
  updateMetarDisplay(panel, nodes()[1], {
    reports: [{ id: "KPWM", metar: "bad <data>", decoded: null }],
  });
  expect(panel.innerHTML).toContain(
    '<td></td><th>KPWM</th><td>—</td><td colspan="9">bad &lt;data&gt;</td>',
  );
});

test("renders the remaining category colors and omits unknown ticker labels", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, {
    reports: ["MVFR", "IFR", "LIFR"].map((flightCategory) => ({
      id: "KXXX",
      metar: "raw",
      decoded: { flightCategory },
    })),
  });
  for (const category of ["mvfr", "ifr", "lifr"])
    expect(panel.innerHTML).toContain(`flight-category-${category}`);
  expect(ticker.innerHTML).toContain("flight-category-mvfr");
  expect(ticker.innerHTML).toContain("flight-category-ifr");
  expect(ticker.innerHTML).toContain("flight-category-lifr");
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
