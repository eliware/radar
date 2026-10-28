export async function checkScreenshotHealth(baseUrl, fetcher) {
  const health = await fetcher(new URL("/health", baseUrl));
  if (!health.ok) throw new Error(`Radar health check failed with HTTP ${health.status}`);
}
