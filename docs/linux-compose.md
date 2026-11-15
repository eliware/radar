# Linux Compose deployment

This guide runs Radar and readsb together on Linux with an RTL-SDR receiver. Docker Compose builds both images locally and starts ADSBX, FlightAware, ADSB.lol, and Flightradar24 feeders in the default stack. The private Compose network carries readsb SBS and Beast data. Radar listens on host TCP port `3000`.

## Requirements

- Linux with Docker Engine and the Docker Compose plugin.
- Node is not required on the host to run the Compose deployment.
- An RTL-SDR receiver connected to the host. An antenna and received aircraft are not required for the containers to report healthy status.
- Git LFS to retrieve the NASR SQLite database when cloning the repository.

The Compose configuration binds `/dev/bus/usb` into readsb and grants access to USB character devices (major 189). This lets the container see device nodes when the receiver is re-enumerated. The container is not privileged. Keep host USB permissions and Docker access for trusted administrators only.

The ADSBX container reads readsb Beast data at private TCP endpoint `30005`. It has no SDR access. Radar keeps its SBS connection at endpoint `30003`. Set `ADSB_LAT`, `ADSB_LON`, and `ADSB_ALT` in `.env` for the antenna location and altitude in feet above sea level.

Radar, ADSBX, and ADSB.lol use these location values. Set `ADSBX_SITENAME` to label the receiver. Create a stable `ADSBX_UUID` with `uuidgen`. This UUID identifies the receiver. It is not an account key.

Compose downloads the feeder images from GHCR. Radar and readsb build locally.

The FlightAware PiAware container also reads Beast data at private TCP endpoint `30005` without SDR access. Its assigned `PIAWARE_FEEDER_ID` is in `.env`, keeping the site identity stable. Claim the receiver through FlightAware. Set its location and antenna altitude on the FlightAware stats page.

Flightradar24 uses the same readsb Beast endpoint, `30005`. After getting a sharing key, run `docker compose run --rm --no-deps --entrypoint /usr/bin/fr24feed fr24 --signup --configfile=/tmp/config.txt` interactively. Supply the account email and antenna location. Select Beast TCP, host `readsb`, and endpoint `30005`. Disable MLAT.

This command runs the signup tool directly before a sharing key exists.

Save the issued key as `FR24_KEY` in `.env` before starting the stack. Compose includes FR24 by default, and the container needs a configured key before startup. Without one, FR24 does not send data. MLAT is disabled in Compose. Do not enable it while sharing with other networks. Flightradar24 recommends this.

The ADSB.lol Ultrafeeder container runs in network-only mode. It forwards readsb Beast data from endpoint `30005` to ADSB.lol. It does not access the SDR or change Radar's SBS connection.

Set a stable `ADSBLOL_UUID` in `.env` for the feeder. Radar accepts an optional `ADSBLOL_API_KEY` for re-api aircraft requests. Keep that key private.

The feeder sends MLAT data with receiver privacy enabled. This hides the receiver from the public MLAT map. Start it with `docker compose up -d adsblol`. Check `docker compose logs -f adsblol` for connection status.

## Configure and start

Clone the repository with Git LFS enabled, then open the checkout:

```sh
git lfs install
git clone git@github.com:eliware/radar.git
cd radar
git lfs pull
```

Copy `.env.example` to `.env`. Set `READSB_DEVICE` to the receiver's serial number or device index. Set `ADSB_LAT`, `ADSB_LON`, and `ADSB_ALT` to its location and elevation. Set `ADSBX_UUID`, `PIAWARE_FEEDER_ID`, and `ADSBLOL_UUID` to stable feeder IDs. Set `FR24_KEY` before starting Flightradar24.

Use `uuidgen` to create UUID values, then keep them stable. Set `ADSBX_SITENAME` to label your receiver. See [Runtime configuration](configuration.md) for all variables.

The default Compose stack starts six containers: `readsb`, `radar`, `adsbx`, `piaware`, `adsblol`, and `fr24`. Set each feeder's required values in `.env`. To run only Radar and readsb, disable the feeder services in `compose.yaml` for that host.

Compose sets `ADSB_HOST=readsb` and `ADSB_PORT=30003`. It does not publish the host input endpoint. Open Radar at `http://<server-ip>:3000` on the LAN.

## Build and check

Use Node.js 26 or later for repository development. From `/opt/radar`, install the locked dependencies and run the project checks:

```sh
npm ci
npm test
npm run lint
npm run format:check
npm run build
```

Keep changes in this checkout. To build and run the current source through Compose, use `docker compose up -d --build` after making changes.

Build and start the default stack:

```sh
docker compose up -d --build
docker compose ps
```

Compose waits for readsb's SBS listener before starting Radar. Check the app endpoints from the host:

```sh
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/ready
```

`/health` confirms that Radar responds to requests. `/ready` returns HTTP 200 when Radar connects to readsb and HTTP 503 while that connection is down. Readiness does not depend on aircraft reception. An antenna is not required for a healthy container status.

## Operate

After committing app changes, run `docker compose up -d --build` to build and start the updated containers. Then check both endpoints:

```sh
docker compose up -d --build
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/ready
```

Inspect container state and logs:

```sh
docker compose ps
docker compose logs -f radar readsb
```

Run these commands to start the receiver decoder again and check Radar's connection:

```sh
docker compose restart readsb
curl -i http://127.0.0.1:3000/ready
```

If the RTL-SDR is unplugged and re-enumerated, readsb can see the new node through the bound USB bus. Check `docker compose logs -f readsb` for device detection, then check `/ready` again. A healthy readsb listener does not confirm RF reception. Check for aircraft after installing the antenna.

Stop the stack while keeping its containers:

```sh
docker compose stop
```

Use `docker compose start` to run it again. To stop and remove the containers and private network:

```sh
docker compose down
```

After updating source or configuration, run:

```sh
git pull
git lfs pull
docker compose up -d --build
```

## Browser screenshots

With the stack running, install Puppeteer's Chrome and capture both above-fold and full-page images at all configured desktop and iPhone viewports:

```sh
npm ci
npm run puppeteer
RADAR_SCREENSHOT_VIEWPORTS=all npm run screenshots
```

Images are written to `artifacts/screenshots/`. Use `RADAR_SCREENSHOT_URL`, `RADAR_SCREENSHOT_VIEWPORTS`, `RADAR_SCREENSHOT_MODES`, or `RADAR_SCREENSHOT_DIR` to select a server, viewport, mode, or output directory. The configured viewport names are defined in `src/frontend/responsive/screenshot/viewports.mjs`.
