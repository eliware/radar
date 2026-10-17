# Radar web API and view

Radar provides a web dashboard, HTTP API, and WebSocket connection. The server reads aircraft data from an SBS/BaseStation TCP connection.

## Start the app

Run `npm run build` to build browser files. Run `node bin/radar.mjs` to start the server. The default TCP endpoint is `3000`. The server listens on `0.0.0.0` for local network access.

Open `http://localhost:3000` on the server computer. Find its Wi-Fi address with `ipconfig` on Windows. Open `http://<computer-ip>:3000` on a device on the same network.

Set `PORT`, `ADSB_HOST`, and `ADSB_PORT` in `.env` or the process environment. The defaults are `3000`, `127.0.0.1`, and `30003`. Set `ADSB_LAT` and `ADSB_LON` as decimal latitude and longitude, and `ADSB_ALT` in feet above mean sea level. The default elevation is 300 feet. Set `RADAR_DEFAULT_RANGE_NM` from 1 through 300 to change the default range. Set `RADAR_DEFAULT_ROTATION` from 0 through 359 to change the default heading in degrees. The defaults are 20 nautical miles and north-up.

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

Radar enriches locally received aircraft with type data from the ADSB.lol v2 API by ICAO address and departure/arrival data from ADSB.lol route JSON by callsign. It stores lookup results in memory only. A lookup failure does not stop aircraft updates. Route data can be inaccurate or missing, especially when callsigns are reused, and unavailable values are left blank. These lookups enrich the local readsb data stream. Radar does not add aircraft from the ADSB.lol network through this mechanism.

The browser reconnects after a WebSocket failure. It waits one second before the first retry. It doubles the interval to a maximum of 30 seconds. After reconnecting, it requests the current aircraft list. The server retries the receiver connection after two seconds.

## Radar view

The radar is a black square, aligned to the top left. The default view is centered on home. The default heading and range use `RADAR_DEFAULT_ROTATION` and `RADAR_DEFAULT_RANGE_NM`. The range starts at the configured default or five nautical miles more than the furthest aircraft. The larger value is used. The range limits are 1 and 300 nautical miles.

The app renders rings every nautical mile under 10 miles. It renders rings every five miles under 60 miles, every 10 miles under 150 miles, and every 25 miles at greater ranges. Bold labels mark rings at 2, 10, 20, or 50-mile intervals. Dark minor rings sit halfway between. Ring labels omit units and sit along a northwest radial, leaving an opening in the rings without a radial line.

The radar shows green symbols while connected. It shows dark gray symbols when the receiver connection drops. Aircraft symbols are hollow diamonds. Labels show callsign, altitude, vertical trend, speed, and type code when known. The label uses the ICAO address when the callsign is missing or is a placeholder. It fades aircraft marks and labels by age. It removes an aircraft after two minutes without an update. It shows a predicted path for 60 seconds and history marks for the last 60 seconds.

ADS-B altitude is barometric altitude. It may not match true altitude above mean sea level.

The 3D view uses Three.js. If WebGL cannot start, the app uses a 2D Canvas view. Both views show the same aircraft, range, rings, reference data, and water outlines. The Canvas view does not show vertical height.

On desktop, move the pointer while holding the left button to turn the view. Hold the right button to pan. Use the scroll wheel to zoom. On mobile, keep home centered. Pinch to zoom and twist two fingers to turn. Panning is disabled on mobile.

The compass shows the current heading. Click it or tap Home to restore the configured default heading and range. Use `Enter` or `Space` when the compass has focus. The compass shows N, S, E, and W. Its center shows a three-digit heading from `000` to `359`.

On mobile, select FOLLOW PHONE to align the radar with the device compass. Select it again to stop tracking. The browser may request sensor permission after the tap. Use HTTPS outside localhost. The radar shows a status when sensor access is unavailable or denied. Manual control remains available when tracking is off.

Use the Up and Down arrow keys to change range. Use the Left and Right arrow keys to turn the radar by 15 degrees. Do not use these keys when an editable field has focus.

Use W to show or hide muted lake and ocean outlines. The browser requests vector tiles from OpenFreeMap. It does not use a Radar server proxy or save tiles to disk. Map data attribution appears at lower left.

The radar legend has a transparent background and aligns each symbol with its label. Wide views use two columns; narrow views use one. The second column sits adjacent to the first.

- Key A toggles airports, their Class B/C/D airspace, runways, and runway guides.
- Key N toggles VORs. Key R toggles runways. Key E toggles runway guides.
- Key I toggles ILS courses and marker beacons. Key D toggles SIDs; key S toggles STARs.
- Key Q toggles RNAV airways. Key J toggles Jet airways. Key V toggles Victor airways. Key W toggles water.
- Key M toggles METARs; hidden METARs stop refreshing. Key F toggles flight strips.

When flight strips are hidden, the radar fills the viewport and route lookups for ORIG/DEST pause. Browser local storage saves visibility choices and restores them on refresh.

## Airport and procedure layers

The browser requests reference data for the current range. It requests only new distance bands as the range grows. It keeps results in browser memory.

Airport markers use pale gray. Labels sit above the markers. VOR symbols and labels use blue. Runway guides use dark gray dotted lines. ILS lines and markers use subdued purple, at about half the previous brightness. SID lines use subdued blue. STAR lines use subdued orange. Use `I` to show or hide ILS paths. Use `D` for SID paths and `S` for STAR paths.

NASR has no local terminal-control boundary shapes. The radar can show FAA ARTCC boundary points and approximate Class B, C, and D shapes. The class shapes are not official boundaries.

## Flight strips and weather

The flight-strip panels sit beside the radar in landscape view and under it in portrait view. Use F to hide or show them. The radar panel uses the full page width while they are hidden. They sort aircraft by distance, closest first. They list callsign, altitude with vertical trend, type, heading with speed, squawk, bearing with rounded range, departure, and destination. They omit field headers and units. Narrow layouts reflow data into aligned rows. The panel uses white text on black with double outer borders and single row dividers. Scrolling works without on-screen scrollbars. Each aircraft card fades as its data ages and disappears when the aircraft times out. Each refresh keeps the current scroll location.

The 3D view shows a decoded VATSIM METAR table at the top center of the radar. Its fields are automation status, airport, flight category, age, wind direction, wind speed, visibility, weather, sky, temperature, dew point, and altimeter pressure. Flight category appears between airport and age, using green for VFR, yellow for MVFR, orange for IFR, and red for LIFR. The 2D view and narrow layouts show a one-line raw report ticker with the same category label and colors.

Set `METAR_STATIONS` to a comma-separated list of ICAO airport codes. The default list is `KLEW,KPWM,KBXM`. The app refreshes reports from VATSIM and caches them for five minutes.

## Check app health

Run `curl.exe http://127.0.0.1:3000/health` to check server status. Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read current aircraft.

Run `curl.exe "http://127.0.0.1:3000/api/airports?minRangeNm=0&maxRangeNm=20"` to read nearby airports. Use the same range values with `/api/navaids`, `/api/airspace-boundaries`, `/api/ils`, or `/api/procedures`.

Connect a WebSocket client to `ws://127.0.0.1:3000/ws` to read live updates.

## Browser checks

Run `npm run puppeteer` to install Chrome. Start the web app. Run `npm run screenshots` to save viewport images under `artifacts/screenshots/`.

Run `npm run screenshots:primary` to capture only the 1280 by 1024 primary monitor view. Run `npm run lighthouse` while the web app runs to save an accessibility report under `artifacts/`.
