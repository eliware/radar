import { expect, test } from "@jest/globals";
import { updateMetarRefreshTicker } from "../../../../src/frontend/metar/refresh/ticker.mjs";

test("selects reports for the ticker or displays the empty state", () => {
  const ticker = { innerHTML: "" };
  updateMetarRefreshTicker(ticker, { reports: [{ id: "KPWM", metar: "04006KT" }] });
  expect(ticker.innerHTML).toContain("KPWM");
  updateMetarRefreshTicker(ticker, { reports: [] });
  expect(ticker.textContent).toBe("No METAR reports available.");
  updateMetarRefreshTicker(ticker, {});
  expect(ticker.textContent).toBe("No METAR reports available.");
  updateMetarRefreshTicker(null, { reports: [] });
});
