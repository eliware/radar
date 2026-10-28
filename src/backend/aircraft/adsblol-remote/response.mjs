export async function parseAdsbLolResponse(response) {
  const body = await response.json();
  return Array.isArray(body?.aircraft) ? body.aircraft : [];
}
