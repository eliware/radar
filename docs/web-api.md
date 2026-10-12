# Web API

## Start

Run `npm run build` to build the browser entry bundle and async chunks. The server serves the entry at `/client.js` and chunks from `/chunks/`.

Run `node bin/radar.mjs` to start the Fastify server.

The server uses `PORT`, `ADSB_HOST`, and `ADSB_PORT`. It reads the same SBS/BaseStation feed as the CLI.
The web server listens on `0.0.0.0` at port `3000` by default. This allows access from devices on the local network.

## REST routes

`GET /health` returns `{"status":"ok"}` when the server responds.

`GET /api/config` returns the local latitude, longitude, and elevation from `.env`.

`GET /api/aircraft` returns an array of recent aircraft. Each item has the same fields as one CLI `--debug` update.

`GET /api/airports?minRangeNm=0&maxRangeNm=20` returns NASR airports in that distance band from `MY_LOCATION`. The maximum range is 300 nautical miles. Each record includes its airport codes, coordinates, elevation, distance, and runway ends. The server returns 503 when NASR data or a home location is not available.

`GET /api/navaids?minRangeNm=0&maxRangeNm=20` returns VOR, VOR/DME, and VORTAC records in the distance band. The response includes the identifier, type, name, coordinates, elevation, and distance.

`GET /api/airspace-boundaries?minRangeNm=0&maxRangeNm=20` returns nearby FAA ARTCC boundary paths from `ARB_SEG`. Each path has ordered points and a low or high altitude class. This table does not include A90 approach control borders.

## WebSocket route

Connect to `ws://localhost:3000/ws` to receive aircraft updates.

The server sends one JSON aircraft object for each valid feed update. The object matches the CLI `--debug` output.

The API has no authentication. Keep access on a trusted network. The Windows firewall rule permits port `3000` from the local subnet.

## 3D view

The browser shows a borderless black radar scope without a map or terrain. Green scope marks appear on black. Darker green marks show minor rings and aircraft history. The range can show 1 to 300 nautical miles from home. The default range is 20 nautical miles or 5 miles beyond the furthest live aircraft, whichever is greater. Auto-zoom runs until you change the view. Reset restores auto-zoom. The app drops targets after 120 seconds without an update. Both views use the same range and rings. They draw rings at 5-mile steps above 10 miles and 1-mile steps below 10 miles. Rings at 10-mile steps use a bold line. The default view looks down at your home location, with north at the top. The home marker sits at the center and uses `MY_ELEVATION` as its altitude reference. If WebGL cannot start, the app shows a 2D Canvas radar with the same range, rings, and aircraft positions.

Both views show each aircraft as a hollow green diamond with a three-line label. The lines show callsign, altitude, and speed without units. The label uses the ICAO code when callsign is blank or unknown, or equals `AD`, `OK`, or `RM`. Altitude uses hundreds of feet. Values below 10,000 feet use three digits with leading zeroes. A `C` marks a vertical rate within 100 feet per minute. Other rates use a signed value in hundreds of feet per minute. Label placement reduces overlap and uses a leader line with a small gap before the diamond. A green line shows the predicted position after 60 seconds. Dark-green backslashes show aircraft positions from the past 60 seconds at half the label font size. Ring range labels show values without units. Aircraft labels use 18 px in 3D and 9 px in Canvas. The 3D labels are twice the size of the Canvas labels.

Both views show a nautical mile scale and a symbol legend at the lower left. The legend identifies aircraft, the 60-second vector, history marks, and home.

Keep a known callsign when a later SBS update has a blank value or a placeholder (`AD`, `OK`, `RM`, `UNKNOWN`, or `-`). Show the ICAO code until a known callsign arrives.

The radar scope stays square. Its width and height match the shorter viewport dimension. It sits at the top left. Landscape views show flight strips on the right. Portrait views show flight strips below the scope. The page has no header or footer. The reset button sits over the scope at the top right.

Flight strips sort aircraft by distance from home, with the closest aircraft first. They show available callsign, ICAO, altitude, speed, heading, vertical rate, squawk, position, range, bearing, and age data. Missing values show a dash. The strips use full headers when all fields fit on one line, then use short headers. Narrow views wrap the header and each aircraft into two or three rows. They show headers once. The black panel uses white text, double outer and header borders, and single dividers between aircraft.

Set `MY_LOCATION` as decimal latitude and longitude in `.env`. Set `MY_ELEVATION` in feet above mean sea level. The default is 300 feet.

The lower-right compass displays the current radar rotation. It has 16 points, labels only N, S, E, and W, and shows the rotation as an upright three-digit value from 000 through 359. The north point is 1.5 times the length of the other cardinal points. The diagonal points are half as long as the cardinal points. The remaining points are half as long as the diagonal points. The compass does not change the radar view when clicked or touched.

On desktop, drag to rotate the 3D view. Right-drag to pan. Use the scroll wheel to zoom. In the 2D fallback, drag to pan and use the scroll wheel to zoom.

On mobile, keep home centered. Pinch to zoom. Twist two fingers to rotate the radar. Panning is disabled. Select Reset view to restore north-up view. The radar scope shows green when the WebSocket feed is connected and dark gray when it is disconnected. The page has no gesture hint or text connection status.

The browser retries a closed or failed WebSocket. It waits one second before the first retry, then doubles the wait up to 30 seconds. It requests a fresh aircraft snapshot after each connection. The SBS TCP feed retries separately after two seconds.

The browser requests airports and navaids from 0 to 20 nautical miles at startup. It requests only the new distance band when the view expands. It keeps loaded records in browser memory. The API returns public-use airports with a four-character ICAO code that starts with K and an asphalt or concrete runway at least 1,000 feet long. The radar draws only qualifying runways. Airport labels sit above their marker dots. Airport markers and labels use light gray. Runway lines use endpoint elevations. Dark gray dotted centerline extensions rise 3,000 feet over 10 nautical miles. Dotted base legs sit at the extension end altitude. VOR, VOR/DME, and VORTAC symbols and identifiers use blue.

NASR marks airports with Class B, C, or D service, but this database has no class boundary shapes. The 3D view draws approximate shells from typical class altitude limits. Class B uses 10, 20, and 30-mile layers up to 10,000 feet MSL. Class C uses a 5-mile core and a 5-to-10-mile shelf. Class D uses a 5-mile radius up to 2,500 feet above the airport. These shapes are visual guides, not official boundaries. The database has no Portland or A90 approach boundary shape. NASR does contain real ARTCC boundary points. The radar draws those paths from the `ARB_SEG` table.

Aircraft altitude uses the value reported by the ADS-B feed. The value is barometric altitude. It can differ from true altitude above mean sea level.

## Smoke check

Run `curl.exe http://127.0.0.1:3000/health` to check server status.

Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read the current aircraft list.

Run `curl.exe "http://127.0.0.1:3000/api/airports?minRangeNm=0&maxRangeNm=20"` to read airports near home.

Run `curl.exe "http://127.0.0.1:3000/api/navaids?minRangeNm=0&maxRangeNm=20"` to read navaids near home.

Run `curl.exe "http://127.0.0.1:3000/api/airspace-boundaries?minRangeNm=0&maxRangeNm=20"` to read nearby ARTCC boundary paths.

Use a WebSocket client to connect to `ws://127.0.0.1:3000/ws` and check update messages.

## Screenshots

Start the web app, then run `npm run screenshots`. The command saves above-fold and full-page images in `artifacts/screenshots/`.

Run `npm run screenshots:primary` to capture the main 1280 × 1024 monitor size only.

The command uses 1280 × 1024, 1920 × 1080, 2560 × 1440, and 3840 × 2160 desktop sizes. It also uses iPhone 12 portrait and landscape sizes.
