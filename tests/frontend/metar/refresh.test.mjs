import { expect, jest, test } from "@jest/globals";
import { default as refreshMetar } from "../../../src/frontend/metar/refresh.mjs";

function elements() {
  return {
    panel: { textContent: "", innerHTML: "" },
    ticker: { textContent: "", innerHTML: "", firstElementChild: null },
  };
}

test("requests METAR data and renders successful responses", async () => {
  const { panel, ticker } = elements();
  const fetchData = jest.fn(async () => ({
    ok: true,
    json: async () => ({ reports: [{ id: "KPWM", metar: "04006KT", decoded: null }] }),
  }));
  await refreshMetar({ fetchData, panel, ticker });
  expect(fetchData).toHaveBeenCalledWith("/api/metar");
  expect(panel.innerHTML).toContain("KPWM");
  expect(ticker.innerHTML).toContain("KPWM");
});

test("shows empty states for unsuccessful and rejected responses", async () => {
  const { panel, ticker } = elements();
  await refreshMetar({ fetchData: async () => ({ ok: false }), panel, ticker });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
  await refreshMetar({
    fetchData: async () => {
      throw new Error("offline");
    },
    panel,
    ticker,
  });
  expect(panel.textContent).toBe("No METAR reports available.");
  expect(ticker.textContent).toBe("No METAR reports available.");
});

test("ignores a response when the refresh is disabled", async () => {
  const { panel, ticker } = elements();
  await refreshMetar({
    fetchData: async () => ({ ok: true, json: async () => ({ reports: [{ id: "KPWM" }] }) }),
    panel,
    ticker,
    isEnabled: () => false,
  });
  await refreshMetar({
    fetchData: async () => {
      throw new Error("offline");
    },
    panel,
    ticker,
    isEnabled: () => false,
  });
  expect(panel.innerHTML).toBe("");
  expect(ticker.innerHTML).toBe("");
});
