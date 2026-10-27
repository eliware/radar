import { metarCategoryLabel } from "../../shared/metar/category.mjs";

export function renderMetarTicker(ticker, reports) {
  ticker.innerHTML = `<span>${reports.map(tickerLine).join("　•　")}</span>`;
  const line = ticker.firstElementChild;
  if (!line) return;
  line.style.animation = "none";
  void line.offsetWidth;
  line.style.animation = "";
}

export function escapeMetarHtml(value) {
  return String(value ?? "—").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );
}

function tickerLine({ id, metar, decoded }) {
  return `${escapeMetarHtml(id)} ${metarCategoryLabel(decoded?.flightCategory)} ${escapeMetarHtml(metar)}`.trim();
}
