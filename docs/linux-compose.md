# Linux Compose deployment

This guide runs Radar and readsb together on a Linux host with an RTL-SDR receiver. Docker Compose builds both images locally. The readsb SBS feed stays on the private Compose network; Radar listens on host port `3000`.

## Requirements

- Linux with Docker Engine and the Docker Compose plugin.
- Node is not required on the host to run the Compose deployment.
- An RTL-SDR receiver connected to the host. An antenna and received aircraft are not required for the services to become healthy.
- Git LFS to retrieve the NASR SQLite database when cloning the repository.

The Compose service binds `/dev/bus/usb` into readsb and grants access to USB character devices (major 189). This lets the container see device nodes when the receiver is re-enumerated. The container is not privileged. Keep the host USB device permissions and Docker access limited to trusted administrators.

## Configure and start

Clone the repository with Git LFS enabled, then enter the checkout:

```sh
git lfs install
git clone git@github.com:eliware/radar.git
cd radar
git lfs pull
```

Copy `.env.example` to `.env` and set `MY_LOCATION`, `MY_ELEVATION`, and any view defaults. The Compose file supplies `ADSB_HOST=readsb` and `ADSB_PORT=30003`; no host port is published for the feed. By default, Radar is available at `http://<server-ip>:3000` on the LAN.

## Develop and validate

Use Node.js 26 or later for repository development. From `/opt/radar`, install the locked dependencies and run the project checks:

```sh
npm ci
npm test
npm run lint
npm run format:check
npm run build
```

Keep changes in this checkout. To build and run the current source through Compose, use `docker compose up -d --build` after making changes.

Build and start both services:

```sh
docker compose up -d --build
docker compose ps
```

Compose waits for readsb's SBS listener before starting Radar. Check the app endpoints from the host:

```sh
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/ready
```

`/health` reports that the Radar process can serve requests. `/ready` returns HTTP 200 after Radar connects to readsb and HTTP 503 while the feed connection is down. Readiness does not depend on receiving aircraft, so an absent antenna or quiet sky does not make the services unhealthy.

## Operate

Follow service state and logs:

```sh
docker compose ps
docker compose logs -f radar readsb
```

Restart the receiver decoder and wait for Radar to reconnect:

```sh
docker compose restart readsb
curl -i http://127.0.0.1:3000/ready
```

If the RTL-SDR is unplugged and re-enumerated, readsb can see the new node through the bound USB bus. Check `docker compose logs -f readsb` for device detection, then check `/ready` again. A healthy readsb listener alone does not confirm RF reception; verify aircraft reception after installing the antenna.

Stop the stack while keeping its containers:

```sh
docker compose stop
```

Start it again with `docker compose start`. To stop and remove the containers and private network:

```sh
docker compose down
```

Rebuild after updating source or configuration:

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
npm run screenshots
```

Images are written to `artifacts/screenshots/`. Use `RADAR_SCREENSHOT_URL`, `RADAR_SCREENSHOT_VIEWPORTS`, `RADAR_SCREENSHOT_MODES`, or `RADAR_SCREENSHOT_DIR` to select a server, viewport, mode, or output directory. The configured viewport names are listed in `src/frontend/responsive-screenshot-options.mjs`.
