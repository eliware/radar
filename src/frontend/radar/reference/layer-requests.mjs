const PATHS = ["airports", "navaids", "airspace-boundaries", "ils", "procedures", "airways"];

export async function fetchRadarReferenceLayers(fetchData, minimum, maximum) {
  return Promise.all(
    PATHS.map(async (path) => {
      const response = await fetchData(`/api/${path}?minRangeNm=${minimum}&maxRangeNm=${maximum}`);
      if (!response.ok) throw new Error(`${path} request failed.`);
      return response.json();
    }),
  );
}
