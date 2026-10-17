# Radar web API and display

Radar provides a web dashboard, REST API, and WebSocket feed. The server reads aircraft data from an SBS/BaseStation TCP feed.

## Start the app

Run `npm run build` to build browser files. Run `node bin/radar.mjs` to start the server. The default port is `3000`. The server listens on `0.0.0.0` for local network access.

Open `http://localhost:3000` on the server computer. Find its Wi-Fi address with `ipconfig` on Windows. Open `http://<computer-ip>:3000` on a device on the same network.

Set `PORT`, `ADSB_HOST`, and `ADSB_PORT` in `.env` or the process environment. The defaults are `3000`, `127.0.0.1`, and `30003`. Set `ADSB_LAT` and `ADSB_LON` as decimal latitude and longitude, and `ADSB_ALT` in feet above mean sea level. The default elevation is 300 feet. Set `RADAR_DEFAULT_RANGE_NM` from 1 through 300 to change the default range. Set `RADAR_DEFAULT_ROTATION` from 0 through 359 to change the default rotation in degrees. Their defaults are 20 nautical miles and north-up.

## REST routes

`GET /health` reports that the Radar server can handle requests. `GET /ready` returns HTTP 200 when Radar has an active SBS TCP connection and HTTP 503 while disconnected. Readiness does not require aircraft reception. `GET /api/config` returns home location and elevation. `GET /api/aircraft` returns recent aircraft.

`GET /api/metar` returns decoded reports for `METAR_STATIONS`. Radar reads reports from the VATSIM METAR API. It caches reports for five minutes. The default station list is `KLEW,KPWM,KBXM`.

The range routes accept `minRangeNm` and `maxRangeNm` query values. The maximum range is 300 nautical miles. Each route needs a configured home location.

- `/api/airports` returns qualifying airports and runway ends.
- `/api/navaids` returns VOR, VOR/DME, and VORTAC records.
- `/api/airspace-boundaries` returns nearby FAA ARTCC paths.
- `/api/ils` returns ILS records and matching marker beacons.
- `/api/procedures` returns SID and STAR paths.

The server returns an error if the NASR database or home location is not available. The API does not require authentication.

## WebSocket

Connect to `ws://localhost:3000/ws` to receive aircraft JSON updates. Each update uses the CLI debug fields and adds lookup fields when available.

Radar looks up aircraft types by ICAO address. It looks up origin and destination by callsign. It stores lookup results in memory only. A lookup failure does not stop aircraft updates. Route data can be wrong or missing.

The browser reconnects after a WebSocket failure. It waits one second before the first retry. It doubles the delay up to 30 seconds. It requests a fresh aircraft list after it reconnects. The server retries the receiver feed after two seconds.

## Radar view

The radar is a black square, aligned to the top left. The default view is centered on home. The default rotation and range use `RADAR_DEFAULT_ROTATION` and `RADAR_DEFAULT_RANGE_NM`. The range starts at the configured default or five nautical miles beyond the furthest aircraft, whichever is greater. The range limits are 1 and 300 nautical miles.

The app draws rings every one nautical mile below 10 miles. It draws rings every five miles below 60 miles, every 10 miles below 150 miles, and every 25 miles at greater ranges. It draws bold labeled rings at 2, 10, 20, or 50-mile intervals. Darker minor rings sit halfway between. Ring labels do not show units and sit along a northwest radial, leaving a gap in the rings there without drawing a radial line.

The radar shows green symbols while connected. It shows dark gray symbols when the feed disconnects. Aircraft symbols are hollow diamonds. Labels show callsign, altitude, vertical trend, speed, and type code when known. The label uses the ICAO address when the callsign is missing or is a placeholder. It fades aircraft marks and labels by age. It removes an aircraft after two minutes without an update. It shows a predicted path for 60 seconds and history marks for the last 60 seconds.

ADS-B altitude is barometric altitude. It can differ from true altitude above mean sea level.

The 3D view uses Three.js. If WebGL cannot start, the app uses a 2D Canvas view. Both views show the same aircraft, range, rings, reference data, and water outlines. The Canvas view does not show vertical height.

On desktop, drag to rotate the view. Right-drag to pan. Use the scroll wheel to zoom. On mobile, keep home centered. Pinch to zoom and twist two fingers to rotate. Panning is disabled on mobile.

The compass shows current rotation. Click it or press Home to restore the configured default rotation and range. Press Enter or Space when the compass has focus. The compass shows N, S, E, and W. The center shows a three-digit rotation from `000` to `359`.

On mobile, select FOLLOW PHONE to rotate the radar with the device compass. Select it again to stop tracking. The browser may ask for sensor permission after the tap. Use HTTPS outside localhost. The radar shows a status when sensor access is unavailable or denied. Manual rotation remains available when tracking is off.

Use the Up and Down arrow keys to zoom in or out. Use the Left and Right arrow keys to rotate the radar by 15 degrees. Do not use these keys when an editable field has focus.

Press W to show or hide faint lake and ocean outlines. The browser requests vector tiles from OpenFreeMap. The browser does not use a Radar server proxy or save tiles to disk. The page shows small map data attribution at the bottom left.

The radar legend has a transparent background. It aligns each symbol with its label. It uses two columns on wide views and one column on narrow views. The second column sits next to the first column. Press A for airports (and their Class B/C/D airspace, runways, and runway guides), N for VORs, R for runways, E for runway guides, I for ILS courses and approach markers, D for SIDs, S for STARs, Q for RNAV airways, J for Jet airways, V for Victor airways, and W for water. All reference layers start enabled.

## Airport and procedure layers

The browser requests reference data for the current range. It requests only new distance bands as the range grows. It keeps results in browser memory.

Airport markers use light gray. Labels sit above the markers. VOR symbols and labels use blue. Runway guides use dark gray dotted lines. ILS lines and markers use dim purple, at about half the previous brightness. SID lines use dim blue. STAR lines use dim orange. Press `I` to show or hide ILS paths. Press `D` for SID paths and `S` for STAR paths.

NASR has no local approach-control boundary shapes. The radar can show FAA ARTCC boundary points and approximate Class B, C, and D shapes. The class shapes are not official boundaries.

## Flight strips and weather

The flight strips sit beside the radar in landscape view and below it in portrait view. Press F to hide or show them. The radar panel uses the full page width while strips are hidden. They sort aircraft by distance, closest first. They show callsign, altitude with vertical trend, type, heading with speed, squawk, bearing with rounded range, origin, and destination. They omit field headers and units. Narrow layouts wrap data into aligned rows. The panel uses white text on black with double outside borders and single row dividers. It supports scrolling without visible scrollbars. Each strip fades as its data ages and disappears when the aircraft times out. Each refresh keeps the current scroll position.

The 3D view shows a decoded VATSIM METAR table at the top center of the radar. Its fields are automation status, airport, flight category, age, wind direction, wind speed, visibility, weather, sky, temperature, dew point, and altimeter setting. Flight category appears between airport and age, using green for VFR, yellow for MVFR, orange for IFR, and red for LIFR. The 2D view and narrow layouts show a one-line raw report ticker with the same category label and colors.

Set `METAR_STATIONS` to a comma-separated list of ICAO airport codes. The default list is `KLEW,KPWM,KBXM`. The service refreshes reports from VATSIM and caches them for five minutes.

## Check the service

Run `curl.exe http://127.0.0.1:3000/health` to check server status. Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read current aircraft.

Run `curl.exe "http://127.0.0.1:3000/api/airports?minRangeNm=0&maxRangeNm=20"` to read nearby airports. Use the same range values with `/api/navaids`, `/api/airspace-boundaries`, `/api/ils`, or `/api/procedures`.

Connect a WebSocket client to `ws://127.0.0.1:3000/ws` to read live updates.

## Browser checks

Run `npm run puppeteer` to install Chrome. Start the web app. Run `npm run screenshots` to save viewport images under `artifacts/screenshots/`.

Run `npm run screenshots:primary` to capture only the 1280 by 1024 primary monitor view. Run `npm run lighthouse` while the web app runs to save an accessibility report under `artifacts/`.
