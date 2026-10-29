import { metarCategoryLabel } from "./category-label.mjs";
import { escapeHtml } from "../html/escape.mjs";

export function renderMetarTicker(ticker, data) {
  if (!ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : Array.isArray(data) ? data : [];
  if (!reports.length) {
    ticker.textContent = "No METAR reports available.";
    return;
  }
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
  const line = ticker.firstElementChild;
  if (!line) return;
  line.style.animation = "none";
  void line.offsetWidth;
  line.style.animation = "";
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeHtml(id)} ${metarCategoryLabel(decoded?.flightCategory)} ${escapeHtml(metar)}`.trim();
}
