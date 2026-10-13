export function updateMetarDisplay(element, ticker, data) {
  if (!element || !ticker) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (!reports.length) {
    element.textContent = "No METAR reports available.";
    ticker.textContent = "No METAR reports available.";
    return;
  }
  const cards = reports.map(
    ({ id, metar }) =>
      `<article><b>${escapeText(id)}</b><span>${escapeText(metar)}</span></article>`,
  );
  element.innerHTML = cards.join("");
  ticker.textContent = reports.map(({ id, metar }) => `${id} ${metar}`).join("　•　");
}

function escapeText(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}
