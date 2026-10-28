export function formatMetarTableHeaders() {
  return [
    "<th></th>",
    "<th>APT</th>",
    "<th>FLT</th>",
    '<th class="metar-age-header">AGE</th>',
    '<th class="metar-wind-header" colspan="2">WIND</th>',
    '<th class="metar-vis-header">VIS</th>',
    '<th class="metar-wx-header">WX</th>',
    '<th class="metar-sky-header">SKY</th>',
    "<th>TMP</th>",
    "<th>DEW</th>",
    "<th>ALT</th>",
  ].join("");
}
