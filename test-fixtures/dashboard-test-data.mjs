export function makeDashboardDocument(protocol = "https:", includeReset = true) {
  const home = {};
  const strips = { clientWidth: 800 };
  const metarDisplay = {
    dataset: {},
    setAttribute: (_name, value) => (metarDisplay.dataset.radarMode = value),
  };
  const reset = { addEventListener: (event, callback) => (reset.callback = callback) };
  return {
    home,
    reset,
    strips,
    location: { protocol, host: "localhost:3000" },
    querySelector(selector) {
      return {
        "[data-scene]": {},
        "[data-home]": home,
        "[data-reset]": includeReset ? reset : null,
        "[data-flight-strips]": strips,
        "[data-metar]": metarDisplay,
        "[data-metar-reports]": { textContent: "", innerHTML: "" },
        "[data-metar-ticker]": { textContent: "" },
      }[selector];
    },
    querySelectorAll() {
      return [];
    },
  };
}

export function jsonResponse(value, ok = true) {
  return { ok, json: async () => value };
}
