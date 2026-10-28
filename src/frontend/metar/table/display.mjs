export function updateMetarDisplayElement(element, data, renderTable, now) {
  if (!element) return;
  const reports = Array.isArray(data?.reports) ? data.reports : [];
  if (!reports.length) {
    element.textContent = "No METAR reports available.";
    return;
  }
  element.innerHTML = renderTable(reports, now);
}
