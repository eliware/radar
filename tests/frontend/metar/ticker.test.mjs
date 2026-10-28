import { expect, jest, test } from "@jest/globals";
import { renderMetarTicker, updateMetarTicker } from "../../../src/frontend/metar/ticker.mjs";

test("renders and restarts the ticker animation with escaped report data", () => {
  const reflow = jest.fn();
  const line = {
    style: { animation: "ticker" },
    get offsetWidth() {
      reflow();
      return 100;
    },
  };
  const ticker = {
    set innerHTML(value) {
      this.markup = value;
      this.firstElementChild = line;
    },
  };
  renderMetarTicker(ticker, [
    { id: "K<WM", metar: "<raw>", decoded: { flightCategory: "VFR" } },
    { id: "KBXM", metar: "raw", decoded: null },
  ]);
  expect(ticker.markup).toContain("K&lt;WM");
  expect(ticker.markup).toContain("&lt;raw&gt;");
  expect(ticker.markup).toContain("　•　KBXM — raw");
  expect(line.style.animation).toBe("");
  expect(reflow).toHaveBeenCalledTimes(1);
});

test("skips animation reset if there is no rendered ticker line", () => {
  const ticker = { innerHTML: "" };
  renderMetarTicker(ticker, []);
  expect(ticker.innerHTML).toBe("<span></span>");
});

test("selects refresh reports or displays the empty state", () => {
  const ticker = { innerHTML: "", textContent: "" };
  updateMetarTicker(ticker, { reports: [{ id: "KPWM", metar: "04006KT" }] });
  expect(ticker.innerHTML).toContain("KPWM");
  updateMetarTicker(ticker, { reports: [] });
  expect(ticker.textContent).toBe("No METAR reports available.");
  updateMetarTicker(ticker, {});
  expect(ticker.textContent).toBe("No METAR reports available.");
  expect(() => updateMetarTicker(null, { reports: [] })).not.toThrow();
});
