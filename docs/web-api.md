# Radar web API and view

Radar provides a web dashboard, HTTP API, and WebSocket connection. The server reads aircraft data from an SBS/BaseStation TCP connection.

## Start the app

Run `npm run build` to build browser files. Run `node bin/radar.mjs` to start the server. The default TCP endpoint is `3000`. The server listens on `0.0.0.0` for local network access.

Open `http://localhost:3000` on the server computer. Find its Wi-Fi address with `ipconfig` on Windows. Open `http://<computer-ip>:3000` on a device on the same network.

Set `PORT`, `ADSB_HOST`, and `ADSB_PORT` in `.env` or the process environment. Their defaults are `3000`, `127.0.0.1`, and `30003`.

Set `ADSB_LAT` and `ADSB_LON` as decimal coordinates. Set `ADSB_ALT` in feet above mean sea level. Default elevation is 300 feet. Set `RADAR_DEFAULT_RANGE_NM` from 1 through 300 to change the default range. Set `RADAR_DEFAULT_ROTATION` from 0 through 359 to change the default heading. Defaults are 20 nautical miles and north-up.

## HTTP endpoints

`GET /health` reports that the Radar server can answer requests. `GET /ready` returns HTTP 200 when Radar has an active SBS TCP connection and HTTP 503 while disconnected. Readiness does not require aircraft reception. `GET /api/config` returns home location and elevation. `GET /api/aircraft` returns recent aircraft.

`GET /api/metar` returns decoded reports for `METAR_STATIONS`. Radar reads reports from the VATSIM METAR API. It caches reports for five minutes. The default airport list is `KLEW,KPWM,KBXM`.

The range routes accept `minRangeNm` and `maxRangeNm` query values. The maximum range is 300 nautical miles. Each route needs a configured home location.

- `/api/airports` returns qualifying airports and runway ends.
- `/api/navaids` returns VOR, VOR/DME, and VORTAC records.
- `/api/airspace-boundaries` returns nearby FAA ARTCC paths.
- `/api/ils` returns ILS records and matching marker beacons.
- `/api/procedures` returns SID and STAR paths.

The server returns an error if the NASR database or home location is not available. The API does not require authentication.

## WebSocket

Connect to `ws://localhost:3000/ws` to receive aircraft JSON updates. Each update uses the CLI debug fields and adds lookup fields when available.

While WebSocket clients are connected, Radar polls the ADSB.lol feeder re-api every six seconds after success. Failed requests use exponential backoff, with delays capped at five minutes. Each browser sends its screen radius. The backend queries to the largest connected radius, capped at 300 nautical miles. Polling stops when all clients disconnect.

Remote aircraft are combined with local readsb reports by ICAO address. When both sources report a target, readsb fields replace remote fields. ADSB.lol re-api supplies type codes and callsigns. Radar requests route data only when a remote record lacks a departure or arrival airport code. Remote-only targets appear yellow-green and expire when reports stop.

Key L shows local readsb aircraft only. Clicking AIRCRAFT applies the same toggle without changing its appearance. Browser storage remembers this mode. ADSB.lol polling pauses when all connected browsers select local-only mode and resumes when any browser requests remote aircraft.

ADSB.lol identifies re-api data as ODbL 1.0 in its [feeder re-api documentation](https://www.adsb.lol/docs/feeders-only/re-api/).

Local aircraft types come from ADSB.lol v2 lookup by ICAO address. Departure and arrival fields use ADSB.lol route JSON by callsign. Results remain in memory. Lookup failures do not stop aircraft updates.

Route data can be inaccurate or missing, especially when callsigns are reused. Unavailable fields stay blank.

The browser reconnects after a WebSocket failure. It waits one second before the first retry. It doubles the interval to a maximum of 30 seconds. After reconnecting, it requests the current aircraft list. The server retries the receiver connection after two seconds.

## Radar view

The radar is a black square, aligned to the top left. The default view is centered on home. The default heading and range use `RADAR_DEFAULT_ROTATION` and `RADAR_DEFAULT_RANGE_NM`. The range starts at the configured default or five nautical miles more than the furthest aircraft. The larger value is used. The range limits are 1 and 300 nautical miles.

The app renders rings every nautical mile under 10 miles. It renders rings every five miles under 60 miles, every 10 miles under 150 miles, and every 25 miles at greater ranges. Bold labels mark rings at 2, 10, 20, or 50-mile intervals. Dark minor rings sit halfway between. Ring labels omit units and sit along a northwest radial, leaving an opening in the rings without a radial line.

The radar shows green symbols while connected. It shows dark gray symbols when the receiver connection drops. Aircraft symbols are hollow diamonds.

Labels show callsign, altitude, vertical trend, speed, and known type. If callsign is missing or a placeholder, the label uses the ICAO address. Aircraft marks and labels fade with age. Targets are removed after two minutes without an update.

A predicted path lasts 60 seconds. History marks cover the last 60 seconds.

ADS-B altitude is barometric altitude. It may not match true altitude above mean sea level.

The 3D view uses Three.js. When WebGL cannot start, Radar uses 2D Canvas. Both views show the same aircraft, range rings, reference data, and water outlines. The Canvas view has no vertical height. The 3D camera uses its frustum for reference data and skips overlay points outside its depth planes. Polling uses zoom and viewport dimensions, so tilt does not expand the ADSB.lol radius.

On desktop, move the pointer while holding the left button to turn the view. Hold the right button to pan. Use the scroll wheel to zoom. On mobile, keep home centered. Pinch to zoom and twist two fingers to turn. Panning is disabled on mobile.

The compass shows the current heading. Click it or tap Home to restore the configured default heading and range. Use `Enter` or `Space` when the compass has focus. The compass shows N, S, E, and W. Its center shows a three-digit heading from `000` to `359`.

On mobile, select FOLLOW PHONE to align the radar with the device compass. Select it again to stop tracking. The browser may request sensor permission after the tap. Use HTTPS outside localhost. The radar shows a status when sensor access is unavailable or denied. Manual control remains available when tracking is off.

Use the Up and Down arrow keys to change range. Use the Left and Right arrow keys to turn the radar by 15 degrees. Do not use these keys when an editable field has focus.

Use W to show or hide muted lake and ocean outlines. The browser requests vector tiles from OpenFreeMap. It does not use a Radar server proxy or save tiles to disk. Map data attribution appears at lower left.

The radar legend has a transparent background and aligns each symbol with its label. Wide views use two columns. Narrow views use one. Tap or click a layer entry to apply its matching keyboard toggle. M controls METAR and F controls flight strips.

- Key A toggles airports, their Class B/C/D airspace, runways, and runway guides.
- Key N toggles VORs. Key R toggles runways. Key E toggles extended runway centerlines.
- Key B toggles base legs. The clickable legend orders `B BASE` after `E ERCL`.
- In two-column legends, `I ILS` starts the second column. Clickable legend entries match their keys.
- Key I toggles ILS courses and marker beacons. Key D toggles SIDs. Key S toggles STARs.
- Key Q toggles RNAV airways. Key J toggles Jet airways. Key V toggles Victor airways. Key W toggles water.
- Key M toggles METARs. Hidden METARs stop refreshing. Key F toggles flight strips.
- Key L shows only local readsb aircraft. Click AIRCRAFT to apply the same toggle.

When flight strips are hidden, the radar fills the viewport and route lookups for ORIG/DEST pause. Browser local storage saves visibility choices and restores them on refresh.

## Airport and procedure layers

The browser requests reference data inside the current view and keeps results in browser memory. Both views request only new distance bands as they expand. The 3D view uses frustum intersections with ground and terminal airspace heights to set query limits. Reference requests stop at 300 nautical miles. Cached airspace meshes outside the current view are hidden. Overlay points behind the camera are skipped.

Airport markers use pale gray. Labels sit above the markers. VOR symbols and labels use blue. Runway guides use dark gray dotted lines.

ILS lines and markers use subdued purple, at about half the previous brightness. SID lines use subdued blue. STAR lines use subdued orange. Use `I` to show or hide ILS paths. Use `D` for SID paths and `S` for STAR paths.

NASR has no local terminal-control boundary shapes. The radar can show FAA ARTCC boundary points and approximate Class B, C, and D shapes. The class shapes are not official boundaries.

## Flight strips and weather

Flight-strip panels sit beside the radar in landscape and under it in portrait. Use F to hide or show them. The radar fills the page while flight cards are hidden. Aircraft sort by distance, closest first.

Each flight card shows callsign, altitude and trend, type, heading and speed, squawk, bearing and rounded range, departure, and destination. Field headers and units are omitted.

Narrow layouts group fields into aligned rows. Cards use white text on black, with a double border and single row dividers. The list scrolls while scrollbars stay hidden. Cards fade with age and are removed after aircraft timeout. Refreshes preserve the scroll offset.

The 3D view shows a decoded VATSIM METAR table at the top center of the radar. Its fields are automation status, airport, flight category, age, wind direction, wind speed, visibility, weather, sky, temperature, dew point, and altimeter pressure. Flight category appears between airport and age, using green for VFR, yellow for MVFR, orange for IFR, and red for LIFR. The 2D view and narrow layouts show a one-line raw report ticker with the same category label and colors.

Set `METAR_STATIONS` to a comma-separated list of ICAO airport codes. The default list is `KLEW,KPWM,KBXM`. The app refreshes reports from VATSIM and caches them for five minutes.

## Check app health

Run `curl.exe http://127.0.0.1:3000/health` to check server status. Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read current aircraft.

Run `curl.exe "http://127.0.0.1:3000/api/airports?minRangeNm=0&maxRangeNm=20"` to read nearby airports. Use the same range values with `/api/navaids`, `/api/airspace-boundaries`, `/api/ils`, or `/api/procedures`.

Connect a WebSocket client to `ws://127.0.0.1:3000/ws` to read live updates.

## Browser checks

Run `npm run puppeteer` to install Chrome. Start the web app. Run `npm run screenshots` to save viewport images under `artifacts/screenshots/`.

Run `npm run screenshots:primary` to capture only the 1280 by 1024 primary monitor view. Run `npm run lighthouse` while the web app runs to save an accessibility report under `artifacts/`.
