import {
  createFlightStripLayout,
  tableBorder,
  tableRow,
  wideTableWidth,
} from "./flight-strip-layout.mjs";

function positionOf(aircraft) {
  if (!Number.isFinite(aircraft.latitude) || !Number.isFinite(aircraft.longitude)) return null;
  return `${aircraft.latitude.toFixed(4)}, ${aircraft.longitude.toFixed(4)}`;
}

function valuesOf(aircraft, now) {
  const withUnit = (value, suffix) =>
    value === null || value === undefined ? "-" : `${value}${suffix}`;
  const altitude = aircraft.altitudeFeet?.toLocaleString("en-US");
  const heading = aircraft.trackDegrees?.toString().padStart(3, "0");
  const bearing = aircraft.bearingDegrees?.toString().padStart(3, "0");
  return [
    aircraft.callsign ?? "-",
    aircraft.icao ?? "-",
    withUnit(altitude, " ft"),
    withUnit(aircraft.groundSpeedKnots, " kt"),
    withUnit(heading, "°"),
    withUnit(aircraft.verticalRateFeetPerMinute, " fpm"),
    aircraft.squawk ?? "-",
    positionOf(aircraft) ?? "-",
    withUnit(aircraft.distanceNauticalMiles, " nm"),
    withUnit(bearing, "°"),
    `${Math.max(0, Math.floor((now - aircraft.lastSeen) / 1000))}s`,
  ];
}

function renderAircraft(rows, layout, lines) {
  for (const [index, values] of rows.entries()) {
    for (const group of layout) {
      lines.push(
        tableRow(
          group.indices.map((column) => values[column]),
          group.widths,
          "║",
          "│",
          "║",
        ),
      );
    }
    if (index < rows.length - 1) {
      lines.push(tableBorder(layout[0].widths, "├", "┼", "┤", "─"));
    }
  }
}

function titleLines(widths, aircraftCount) {
  const total = widths.reduce((sum, width) => sum + width, 3 * widths.length + 1);
  const count = ` ${aircraftCount} AIRCRAFT `;
  const countWidth = count.length;
  const titleWidth = total - countWidth - 7;
  const title = " RADAR CLI";
  const top = `╔${"═".repeat(titleWidth + 2)}╤${"═".repeat(countWidth + 2)}╗`;
  const titleCell = title.slice(0, titleWidth + 2).padEnd(titleWidth + 2);
  const row = `║${titleCell}│${count.padStart(countWidth + 2)}║`;
  return [top, row];
}

function renderTable(aircraft, width, now) {
  const rows = aircraft.map((item) => valuesOf(item, now()));
  const layout = createFlightStripLayout(width, rows);
  const widths = layout[0].widths;
  const lines = titleLines(widths, aircraft.length);
  lines.push(tableBorder(widths, "╠", "╤", "╣", "═"));
  for (const group of layout) {
    lines.push(tableRow(group.labels, group.widths, "║", "│", "║"));
  }
  lines.push(tableBorder(widths, "╠", "╪", "╣", "═"));
  if (rows.length) renderAircraft(rows, layout, lines);
  else {
    const titleWidth = widths.reduce((sum, width) => sum + width, 3 * widths.length - 3);
    lines.push(tableRow(["Waiting for aircraft..."], [titleWidth]));
  }
  lines.push(tableBorder(widths, "╚", "╧", "╝", "═"));
  return lines;
}

export function renderFlightStrips(
  aircraft,
  { now = Date.now, clearScreen = true, width = wideTableWidth } = {},
) {
  const lines = clearScreen ? ["\u001b[2J\u001b[H"] : [];
  const terminalWidth = Math.max(20, Number.isFinite(width) ? width : wideTableWidth);
  lines.push(...renderTable(aircraft, terminalWidth, now));
  return lines.join("\n");
}
