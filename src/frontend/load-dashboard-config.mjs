export async function loadDashboardConfig(fetchData) {
  const [config, mapOutlines] = await Promise.all([
    fetchJson(fetchData, "/api/config"),
    fetchJson(fetchData, "/api/map-outlines").catch(() => null),
  ]);
  return { config, mapOutlines };
}

async function fetchJson(fetchData, path) {
  const response = await fetchData(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}
