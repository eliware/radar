import { expect, test } from "@jest/globals";
import { updateMetarRefreshDisplay } from "../../../../src/frontend/metar/refresh/display.mjs";

test("updates the decoded report table and ticker", () => {
  const panel = { innerHTML: "", textContent: "" };
  const ticker = { innerHTML: "", textContent: "" };

  updateMetarRefreshDisplay(panel, ticker, {
    reports: [{ id: "KPWM", metar: "04006KT", decoded: { flightCategory: "VFR" } }],
  });

  expect(panel.innerHTML).toContain("KPWM");
  expect(ticker.innerHTML).not.toBe("");
});

test("renders the empty state when there are no reports", () => {
  const panel = { innerHTML: "", textContent: "" };
  const ticker = { innerHTML: "", textContent: "" };

  updateMetarRefreshDisplay(panel, ticker, { reports: [] });

  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
});

test("treats missing report data as an empty ticker", () => {
  const ticker = { innerHTML: "", textContent: "" };

  updateMetarRefreshDisplay(null, ticker, {});

  expect(ticker.textContent).toBe("No METAR reports available.");
});

test("supports missing panel and ticker elements", () => {
  expect(() => updateMetarRefreshDisplay(null, null, { reports: [] })).not.toThrow();
});
