export async function readJson(fetchData, path) {
  const response = await fetchData(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}
