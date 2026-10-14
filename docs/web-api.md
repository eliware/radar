# Radar web API and display

Radar provides a web dashboard, REST API, and WebSocket feed. The server reads aircraft data from an SBS/BaseStation TCP feed.

## Start the app

Run `npm run build` to build browser files. Run `node bin/radar.mjs` to start the server. The default port is `3000`. The server listens on `0.0.0.0` for local network access.

Open `http://localhost:3000` on the server computer. Find its Wi-Fi address with `ipconfig` on Windows. Open `http://<computer-ip>:3000` on a device on the same network.

Set `PORT`, `ADSB_HOST`, and `ADSB_PORT` in `.env` or the process environment. The defaults are `3000`, `127.0.0.1`, and `30003`. Set `MY_LOCATION` as decimal latitude and longitude. Set `MY_ELEVATION` in feet above mean sea level. The default elevation is 300 feet.

## REST routes

`GET /health` returns server status. `GET /api/config` returns home location and elevation. `GET /api/aircraft` returns recent aircraft.

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

The radar is a black square, aligned to the top left. The default view is centered on home, with north up. The range starts at 20 nautical miles or five miles beyond the furthest aircraft, whichever is greater. The range limits are 1 and 300 nautical miles.

The app draws rings every one nautical mile below 10 miles. It draws rings every five miles below 60 miles, every 10 miles below 150 miles, and every 25 miles at greater ranges. It draws bold labeled rings at 2, 10, 20, or 50-mile intervals. Darker minor rings sit halfway between. Ring labels do not show units.

The radar shows green symbols while connected. It shows dark gray symbols when the feed disconnects. Aircraft symbols are hollow diamonds. Labels show callsign, altitude, vertical trend, speed, and type code when known. The label uses the ICAO address when the callsign is missing or is a placeholder. It fades aircraft marks and labels by age. It removes an aircraft after two minutes without an update. It shows a predicted path for 60 seconds and history marks for the last 60 seconds.

ADS-B altitude is barometric altitude. It can differ from true altitude above mean sea level.

The 3D view uses Three.js. If WebGL cannot start, the app uses a 2D Canvas view. Both views show the same aircraft, range, rings, reference data, and water outlines. The Canvas view does not show vertical height.

On desktop, drag to rotate the view. Right-drag to pan. Use the scroll wheel to zoom. On mobile, keep home centered. Pinch to zoom and twist two fingers to rotate. Panning is disabled on mobile.

The compass shows current rotation. Click it or press R to face north and restore the default range. Press Enter or Space when the compass has focus. The compass shows N, S, E, and W. The center shows a three-digit rotation from `000` to `359`.

Use the Up and Down arrow keys to zoom in or out. Use the Left and Right arrow keys to rotate the radar by 15 degrees. Do not use these keys when an editable field has focus.

Press W to show or hide faint lake and ocean outlines. The browser requests vector tiles from OpenFreeMap. The browser does not use a Radar server proxy or save tiles to disk. The page shows map data attribution.

## Airport and procedure layers

The browser requests reference data for the current range. It requests only new distance bands as the range grows. It keeps results in browser memory.

Airport markers use light gray. Labels sit above the markers. VOR symbols and labels use blue. Runway guides use dark gray dotted lines. ILS lines and markers use dim orange. SID lines use dim blue. STAR lines use dim orange. Press `I` to show or hide ILS paths. Press `S` to show or hide SID and STAR paths.

NASR has no local approach-control boundary shapes. The radar can show FAA ARTCC boundary points and approximate Class B, C, and D shapes. The class shapes are not official boundaries.

## Flight strips and weather

The flight strips sit beside the radar in landscape view and below it in portrait view. They sort aircraft by distance, closest first. They show callsign, altitude with vertical trend, type, heading with speed, squawk, bearing with rounded range, origin, and destination. They omit field headers and units. Narrow layouts wrap data into aligned rows. The panel uses white text on black with double outside borders and single row dividers. It supports scrolling without visible scrollbars.

The 3D view shows a decoded VATSIM METAR table at the top center of the radar. Its fields are automation status, airport, age, wind direction, wind speed, visibility, weather, sky, temperature, dew point, and altimeter setting. The 2D view and narrow layouts show a larger one-line raw report ticker.

Set `METAR_STATIONS` to a comma-separated list of ICAO airport codes. The default list is `KLEW,KPWM,KBXM`. The service refreshes reports from VATSIM and caches them for five minutes.

## Check the service

Run `curl.exe http://127.0.0.1:3000/health` to check server status. Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read current aircraft.

Run `curl.exe "http://127.0.0.1:3000/api/airports?minRangeNm=0&maxRangeNm=20"` to read nearby airports. Use the same range values with `/api/navaids`, `/api/airspace-boundaries`, `/api/ils`, or `/api/procedures`.

Connect a WebSocket client to `ws://127.0.0.1:3000/ws` to read live updates.

## Browser checks

Run `npm run puppeteer` to install Chrome. Start the web app. Run `npm run screenshots` to save viewport images under `artifacts/screenshots/`.

Run `npm run screenshots:primary` to capture only the 1280 by 1024 primary monitor view. Run `npm run lighthouse` while the web app runs to save an accessibility report under `artifacts/`.
