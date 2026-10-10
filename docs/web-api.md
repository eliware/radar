# Web API

## Start

Run `npm run build` to build the browser bundle.

Run `node bin/radar.mjs` to start the Fastify server.

The server uses `PORT`, `ADSB_HOST`, and `ADSB_PORT`. It reads the same SBS/BaseStation feed as the CLI.

## REST routes

`GET /health` returns `{"status":"ok"}` when the server responds.

`GET /api/config` returns the local latitude, longitude, and elevation from `.env`.

`GET /api/aircraft` returns an array of recent aircraft. Each item has the same fields as one CLI `--debug` update.

## WebSocket route

Connect to `ws://localhost:3000/ws` to receive aircraft updates.

The server sends one JSON aircraft object for each valid feed update. The object matches the CLI `--debug` output.

The API has no authentication. Keep access on a trusted network.

## 3D view

The browser shows a black radar scope without a map or terrain. Range rings mark each 5 nautical miles. Rings at 10-mile steps use a bold line. The default view looks down at your home location, with north at the top. The home marker sits at the center and uses `MY_ELEVATION` as its altitude reference.

Set `MY_LOCATION` as decimal latitude and longitude in `.env`. Set `MY_ELEVATION` in feet above mean sea level. The default is 300 feet.

Drag to rotate the view. Right-drag to pan. Use the scroll wheel to zoom. Select Reset view to restore the default camera.

Aircraft altitude uses the value reported by the ADS-B feed. The value is barometric altitude. It can differ from true altitude above mean sea level.

## Smoke check

Run `curl.exe http://127.0.0.1:3000/health` to check server status.

Run `curl.exe http://127.0.0.1:3000/api/aircraft` to read the current aircraft list.

Use a WebSocket client to connect to `ws://127.0.0.1:3000/ws` and check update messages.

## Screenshots

Start the web app, then run `npm run screenshots`. The command saves above-fold and full-page images in `artifacts/screenshots/`.

The command uses 1920 × 1080, 2560 × 1440, and 3840 × 2160 desktop sizes. It also uses iPhone 12 portrait and landscape sizes.
