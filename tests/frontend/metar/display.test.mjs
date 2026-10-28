import { expect, test } from "@jest/globals";
import { renderMetarDisplay } from "../../../src/frontend/metar/display.mjs";

test("updates the METAR table and ticker from the same report set", () => {
  const panel = { textContent: "", innerHTML: "" };
  const ticker = { textContent: "", innerHTML: "", firstElementChild: null };
  const reports = [{ id: "KPWM", metar: "04006KT", decoded: null }];
  renderMetarDisplay(panel, ticker, { reports });
  expect(panel.innerHTML).toContain("KPWM");
  expect(ticker.innerHTML).toContain("KPWM");
});

test("updates both empty states when there are no reports", () => {
  const panel = { textContent: "", innerHTML: "" };
  const ticker = { textContent: "", innerHTML: "" };
  renderMetarDisplay(panel, ticker, { reports: [] });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
});
