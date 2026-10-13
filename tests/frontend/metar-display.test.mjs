import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../src/frontend/metar-display.mjs";

function nodes() {
  return [{ textContent: "", innerHTML: "" }, { textContent: "" }];
}

const decoded = {
  observed: "13 16:51Z",
  wind: "290° 12G18 KT",
  visibility: "10 SM",
  conditions: "-RA",
  clouds: "FEW 4500 SCT 25000",
  temperature: "18/7 °C",
  altimeter: "29.92 inHg",
};

test("renders decoded METAR rows and builds a mobile ticker", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, {
    reports: [
      { id: "KLEW", metar: "02004KT", decoded },
      { id: "KPWM", metar: "04006KT", decoded },
    ],
  });
  expect(panel.innerHTML).toContain("<th>STATION</th>");
  expect(panel.innerHTML).toContain("<td>KLEW</td><td>13 16:51Z</td><td>290° 12G18 KT</td>");
  expect(panel.innerHTML.match(/<tr>/g)).toHaveLength(3);
  expect(ticker.textContent).toBe("KLEW 02004KT　•　KPWM 04006KT");
});

test("shows raw METAR text when the parser cannot decode a report", () => {
  const [panel] = nodes();
  updateMetarDisplay(panel, nodes()[1], {
    reports: [{ id: "KPWM", metar: "bad <data>", decoded: null }],
  });
  expect(panel.innerHTML).toContain('<th>KPWM</th><td colspan="7">bad &lt;data&gt;</td>');
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
