# Web API

## Start

Run `npm run build` to build the browser bundle.

Run `node bin/radar.mjs` to start the Fastify server.

The server uses `PORT`, `ADSB_HOST`, and `ADSB_PORT`. It reads the same SBS/BaseStation feed as the CLI.
The web server listens on `0.0.0.0` at port `3000` by default. This allows access from devices on the local network.

## REST routes

`GET /health` returns `{"status":"ok"}` when the server responds.

`GET /api/config` returns the local latitude, longitude, and elevation from `.env`.

`GET /api/aircraft` returns an array of recent aircraft. Each item has the same fields as one CLI `--debug` update.

## WebSocket route

Connect to `ws://localhost:3000/ws` to receive aircraft updates.

The server sends one JSON aircraft object for each valid feed update. The object matches the CLI `--debug` output.

The API has no authentication. Keep access on a trusted network. The Windows firewall rule permits port `3000` from the local subnet.

## 3D view

The browser shows a borderless black radar scope without a map or terrain. Green scope marks appear on black. Darker green marks show minor rings and aircraft history. The range can show 1 to 300 nautical miles from home. The default range is 20 nautical miles or 5 miles beyond the furthest live aircraft, whichever is greater. Auto-zoom runs until you change the view. Reset restores auto-zoom. The app drops targets after 120 seconds without an update. Both views use the same range and rings. They draw rings at 5-mile steps above 10 miles and 1-mile steps below 10 miles. Rings at 10-mile steps use a bold line. The default view looks down at your home location, with north at the top. The home marker sits at the center and uses `MY_ELEVATION` as its altitude reference. If WebGL cannot start, the app shows a 2D Canvas radar with the same range, rings, and aircraft positions.

Both views show each aircraft as a hollow green diamond with a three-line label. The lines show callsign, altitude, and speed without units. The label uses the ICAO code when callsign is blank or unknown, or equals `AD`, `OK`, or `RM`. Altitude uses hundreds of feet. Values below 10,000 feet use three digits with leading zeroes. A `C` marks a vertical rate within 100 feet per minute. Other rates use a signed value in hundreds of feet per minute. Label placement reduces overlap and uses a leader line with a small gap before the diamond. A green line shows the predicted position after 60 seconds. Dark-green backslashes show aircraft positions from the past 60 seconds at half the label font size. Ring range labels show values without units. Aircraft labels use 18 px in 3D and 9 px in Canvas. The 3D labels are twice the size of the Canvas labels.

Both views show a nautical mile scale and a symbol legend at the lower left. The legend identifies aircraft, the 60-second vector, history marks, and home.

The radar scope stays square. Its width and height match the shorter viewport dimension. It sits at the top left. Landscape views leave space on the right for flight strips. Portrait views leave space below the scope for flight strips. The page has no header or footer. The reset button sits over the scope at the top right.

Set `MY_LOCATION` as decimal latitude and longitude in `.env`. Set `MY_ELEVATION` in feet above mean sea level. The default is 300 feet.

On desktop, drag to rotate the 3D view. Right-drag to pan. Use the scroll wheel to zoom. In the 2D fallback, drag to pan and use the scroll wheel to zoom.

On mobile, keep home centered. Pinch to zoom. Twist two fingers to rotate the radar. Panning is disabled. Select Reset view to restore north-up view.

Aircraft altitude uses the value reported by the ADS-B feed. The value is barometric altitude. It can differ from true altitude above mean sea level.

## Smoke check

Run `curl.exe http://127.0.0.1:3000/health` to check server status.

Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read the current aircraft list.

Use a WebSocket client to connect to `ws://127.0.0.1:3000/ws` and check update messages.

## Screenshots

Start the web app, then run `npm run screenshots`. The command saves above-fold and full-page images in `artifacts/screenshots/`.

The command uses 1920 × 1080, 2560 × 1440, and 3840 × 2160 desktop sizes. It also uses iPhone 12 portrait and landscape sizes.
