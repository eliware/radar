const apiRoot = "https://api.adsb.lol";
const userAgent = "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)";

export function createAircraftTypeLookup(request, lookup) {
  return (value) => {
    const hex = normalize(value);
    if (!hex) return Promise.resolve(null);
    return lookup(`aircraft:${hex}`, async () => {
      const response = await request(`${apiRoot}/v2/hex/${encodeURIComponent(hex)}`, {
        headers: { "user-agent": userAgent },
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("ADSB.lol request failed");
      const body = await response.json();
      const aircraft = body?.ac?.find((item) => normalize(item.hex) === hex);
      const code = aircraft?.t;
      return typeof code === "string" && code.trim() ? { aircraftTypeCode: code.trim() } : null;
    });
  };
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}
