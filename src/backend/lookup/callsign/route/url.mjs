const routeRoot = "https://vrs-standing-data.adsb.lol/routes";

export function buildCallsignRouteUrl(callsign) {
  const path =
    `${encodeURIComponent(callsign.slice(0, 2))}/` + `${encodeURIComponent(callsign)}.json`;
  return `${routeRoot}/${path}`;
}
