import { expect, test } from "@jest/globals";
import { updateMetarTicker } from "../../../src/frontend/metar/ticker-update.mjs";

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
