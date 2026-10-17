import { attachFlightStripsToggle } from "./attach-flight-strips-toggle.mjs";
import { attachMetarDisplayToggle } from "./attach-metar-display-toggle.mjs";
import { readToggleState, writeToggleState } from "./toggle-state-storage.mjs";

export function attachDashboardDisplayToggles(documentRef, fetchData, onMetarEnabled) {
  const dashboard = documentRef.querySelector(".dashboard");
  const flightPanel = documentRef.querySelector("[data-flight-strips]");
  const metarPanel = documentRef.querySelector("[data-metar]");
  flightPanel.hidden = !readToggleState("flightStrips");
  metarPanel.hidden = !readToggleState("metar");
  const strips = attachFlightStripsToggle(documentRef, dashboard, flightPanel, (enabled) => {
    writeToggleState("flightStrips", enabled);
    setRouteLookupsEnabled(fetchData, enabled);
  });
  setRouteLookupsEnabled(fetchData, !flightPanel.hidden);
  const metar = attachMetarDisplayToggle(documentRef, metarPanel, (enabled) => {
    writeToggleState("metar", enabled);
    onMetarEnabled(enabled);
  });
  return { panel: metarPanel, detachFlightStripsToggle: strips, detachMetarDisplayToggle: metar };
}

function setRouteLookupsEnabled(fetchData, enabled) {
  fetchData("/api/route-lookups", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ enabled }),
  }).catch(() => undefined);
}
