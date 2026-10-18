const ENTRIES = [
  ["diamond", "AIRCRAFT", "bright"],
  ["line", "60s VECTOR", "bright"],
  ["slash", "HISTORY", "trail"],
  ["circle", "HOME", "bright"],
  ["circle", "A AIRPORT", "airport", "airportVisible", "a"],
  ["cross", "N VOR", "vor", "navaidsVisible", "n"],
  ["line", "R RUNWAY", "runway", "runwaysVisible", "r"],
  ["dash", "E ERCL", "extension", "extensionsVisible", "e"],
  ["dash", "I ILS", "ils", "ilsVisible", "i"],
  ["dash", "D SID", "sid", "sidVisible", "d"],
  ["dash", "S STAR", "star", "starVisible", "s"],
  ["dash", "Q RNAV", "airwayQ", "airwayQVisible", "q"],
  ["dash", "J JET", "airwayJ", "airwayJVisible", "j"],
  ["dash", "V VICTOR", "airwayV", "airwayVVisible", "v"],
  ["wave", "W WATER", "water", "waterVisible", "w"],
  ["line", "M METAR", "metar", "metarVisible", "m"],
  ["line", "F STRIPS", "strips", "flightStripsVisible", "f"],
];

export function radarLegendLayout(width, height) {
  const columns = width >= 640 ? 2 : 1;
  const rows = Math.ceil(ENTRIES.length / columns);
  const firstY = height - 54 - (rows - 1) * 16;
  return ENTRIES.map((entry, index) => {
    const column = Math.floor(index / rows);
    const row = index % rows;
    return { entry, x: 12 + column * 112, y: firstY + row * 16 };
  });
}

export function findRadarLegendToggle(width, height, x, y) {
  return radarLegendLayout(width, height).find(
    ({ entry, x: left, y: top }) =>
      entry[4] && x >= left - 8 && x <= left + 108 && y >= top - 8 && y <= top + 8,
  )?.entry[4];
}
