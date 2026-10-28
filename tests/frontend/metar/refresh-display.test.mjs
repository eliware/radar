import { expect, test } from "@jest/globals";
import { renderMetarRefreshResponse } from "../../../src/frontend/metar/refresh-display.mjs";

function elements() {
  return {
    panel: { textContent: "", innerHTML: "" },
    ticker: { textContent: "", innerHTML: "", firstElementChild: null },
  };
}

test("renders successful responses in the table and ticker", async () => {
  const { panel, ticker } = elements();
  await renderMetarRefreshResponse(panel, ticker, async () => ({
    ok: true,
    json: async () => ({ reports: [{ id: "KPWM", metar: "04006KT", decoded: null }] }),
  }));
  expect(panel.innerHTML).toContain("KPWM");
  expect(ticker.innerHTML).toContain("KPWM");
});

test("shows empty states for unsuccessful and rejected responses", async () => {
  const { panel, ticker } = elements();
  await renderMetarRefreshResponse(panel, ticker, async () => ({ ok: false }));
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
  await renderMetarRefreshResponse(panel, ticker, async () => {
    throw new Error("offline");
  });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
});

test("ignores a response after refresh has been disabled", async () => {
  const { panel, ticker } = elements();
  await renderMetarRefreshResponse(
    panel,
    ticker,
    async () => ({ ok: true, json: async () => ({ reports: [{ id: "KPWM", metar: "METAR" }] }) }),
    () => false,
  );
  await renderMetarRefreshResponse(
    panel,
    ticker,
    async () => {
      throw new Error("offline");
    },
    () => false,
  );
  expect(panel.innerHTML).toBe("");
  expect(ticker.innerHTML).toBe("");
});
