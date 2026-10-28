const API_ROOT = "https://metar.vatsim.net/";

export async function fetchMetarReports(stations, fetchData = fetch) {
  const response = await fetchData(`${API_ROOT}${stations.join(",")}?format=json`);
  if (!response.ok) throw new Error(`VATSIM METAR request failed: ${response.status}`);
  const reports = await response.json();
  if (!Array.isArray(reports)) throw new Error("VATSIM METAR response must be an array.");
  return reports.filter(
    (report) => stations.includes(report.id) && typeof report.metar === "string",
  );
}
