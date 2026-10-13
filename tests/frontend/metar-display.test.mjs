import { expect, test } from "@jest/globals";
import { updateMetarDisplay } from "../../src/frontend/metar-display.mjs";

function nodes() {
  return [{ textContent: "", innerHTML: "" }, { textContent: "" }];
}

test("renders one block per report and builds a mobile ticker", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, {
    reports: [
      { id: "KLEW", metar: "02004KT" },
      { id: "KPWM", metar: "04006KT" },
    ],
  });
  expect(panel.innerHTML).toContain("<b>KLEW</b><span>02004KT</span>");
  expect(panel.innerHTML).toContain("<b>KPWM</b><span>04006KT</span>");
  expect(ticker.textContent).toBe("KLEW 02004KT　•　KPWM 04006KT");
});

test("escapes report text before it enters the page", () => {
  const [panel, ticker] = nodes();
  updateMetarDisplay(panel, ticker, { reports: [{ id: "K<WM", metar: "<img> & '" }] });
  expect(panel.innerHTML).toBe(
    "<article><b>K&lt;WM</b><span>&lt;img&gt; &amp; &#39;</span></article>",
  );
  expect(ticker.textContent).toBe("K<WM <img> & '");
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
