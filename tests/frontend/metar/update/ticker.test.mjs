import { expect, test } from "@jest/globals";
import { updateMetarTicker } from "../../../../src/frontend/metar/update/ticker.mjs";

test("updates ticker reports and handles empty or missing data", () => {
  const line = { style: {} };
  const ticker = {
    textContent: "",
    set innerHTML(value) {
      this.markup = value;
      this.firstElementChild = line;
    },
  };
  updateMetarTicker(ticker, { reports: [{ id: "KPWM", metar: "04006KT" }] });
  expect(ticker.markup).toContain("KPWM");
  updateMetarTicker(ticker, { reports: [] });
  expect(ticker.textContent).toBe("No METAR reports available.");
  updateMetarTicker(ticker, {});
  expect(ticker.textContent).toBe("No METAR reports available.");
  expect(() => updateMetarTicker(null, { reports: [] })).not.toThrow();
});
