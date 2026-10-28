import { expect, test } from "@jest/globals";
import { renderMetarDisplay } from "../../../src/frontend/metar/display.mjs";

function elements() {
  return {
    panel: { textContent: "", innerHTML: "" },
    ticker: { textContent: "", innerHTML: "", firstElementChild: null },
  };
}

test("updates the METAR table and ticker from the same report set", () => {
  const { panel, ticker } = elements();
  const reports = [{ id: "KPWM", metar: "04006KT", decoded: null }];
  renderMetarDisplay(panel, ticker, { reports });
  expect(panel.innerHTML).toContain("KPWM");
  expect(ticker.innerHTML).toContain("KPWM");
});

test("updates both empty states when there are no reports", () => {
  const { panel, ticker } = elements();
  renderMetarDisplay(panel, ticker, { reports: [] });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
});
