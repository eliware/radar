import { metarCategoryLabel } from "./category-label.mjs";
import { escapeMetarHtml } from "./escape.mjs";

export { escapeMetarHtml } from "./escape.mjs";

export function renderMetarTicker(ticker, reports) {
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
  const line = ticker.firstElementChild;
  if (!line) return;
  line.style.animation = "none";
  void line.offsetWidth;
  line.style.animation = "";
}

export function updateMetarTicker(ticker, data) {
  if (!ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (reports.length) renderMetarTicker(ticker, reports);
  else ticker.textContent = "No METAR reports available.";
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeMetarHtml(id)} ${metarCategoryLabel(decoded?.flightCategory)} ${escapeMetarHtml(metar)}`.trim();
}
