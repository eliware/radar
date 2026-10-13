# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/radar [![npm](https://img.shields.io/npm/v/@eliware/radar)](https://www.npmjs.com/package/@eliware/radar) [![License](https://img.shields.io/github/license/eliware/radar)](https://github.com/eliware/radar/blob/main/LICENSE) [![CI](https://github.com/eliware/radar/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/radar/actions/workflows/ci.yaml)

Web-based aviation tracking app and real-time ADS-B CLI for RTL-SDR receivers.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Routes](#routes)
- [Assets](#assets)
- [Development server](#development-server)
- [Build](#build)
- [Deployment](#deployment)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Radar is a local web dashboard and CLI for ADS-B aircraft data. The server uses Fastify. The dashboard uses a Three.js radar view and a 2D Canvas fallback. It includes flight strips, aircraft details, airport references, and a passive compass. The CLI reads decoded aircraft records from an SBS/BaseStation TCP feed.

## Requirements

Use Node.js 26 or later and npm 12 or later. CI runs on Ubuntu. We directly validate changes on Windows when the change record says so. We infer macOS support from Node.js APIs; we do not claim direct macOS validation.

## Setup

Run `npm ci` in a checkout. Copy `.env.example` to an untracked `.env` only when you need custom settings. Run `npm run build` before you start the web app.

After npm publication, install the package with `npm install --global @eliware/radar`. From a checkout, run `node bin/adsb.mjs`.

## Usage

Run `node bin/radar.mjs` to serve the web app on port 3000. The server listens on `0.0.0.0`. Open `http://localhost:3000` on this computer. Use the computer's Wi-Fi address on a phone on the same network. The app reads the feed at `127.0.0.1:30003`.

Run `node bin/adsb.mjs` to start the CLI. The CLI shows live flight strips. Add `--debug` to print aircraft JSON lines. Use `--host` and `--port` to select another feed.

The package version in `package.json` is the release version. Releases use matching `vMAJOR.MINOR.PATCH` tags. After an authorized release, verify the version with `npm view @eliware/radar@VERSION version`.

Read [release notes](RELEASE_NOTES.md) for released changes.

## Development

Read [AGENTS.md](AGENTS.md), [specs/README.md](specs/README.md), and [RELEASE_NOTES.md](RELEASE_NOTES.md) before changes. Each source module has one matching test in the same folder tree. Read [documentation](docs/README.md) for user workflows.

## Testing

Run `npm test` for Jest, lint, format checks, audit, package checks, conventions, and the web build. Run `npm run pack` to validate the npm archive. Run `npm run format:check` for a read-only format check. CI runs `npm ci` and `npm test`.

## Troubleshooting

If the web app does not start, check that Node.js 26 is installed and `PORT` is an integer from 1 through 65535. If the app or CLI cannot connect, check `ADSB_HOST`, `ADSB_PORT`, and the receiver feed. Both clients retry after two seconds. RTL1090 must enable SBS/BaseStation TCP output on port 30003.

## Security

The web app serves local assets and a local aircraft API. The API has no authentication. Keep access to the local network controlled. The server and CLI read the configured receiver feed. Radar does not write persistent data. Keep `.env`, credentials, tokens, and private keys out of version control and package files.

## Configuration

Runtime settings come from environment variables or an untracked `.env` file. `PORT` defaults to 3000 and accepts integers from 1 through 65535. `LOG_LEVEL` defaults to `info`. `ADSB_HOST` defaults to `127.0.0.1`. `ADSB_PORT` defaults to 30003 and accepts integers from 1 through 65535. Set optional `MY_LOCATION` as decimal latitude and longitude, separated by a comma. Set `MY_ELEVATION` in feet above mean sea level; it defaults to 300. CLI flags `--host` and `--port` override feed settings.

Set optional `METAR_STATIONS` to a comma-separated list of four-character ICAO codes. Radar shows reports from the public VATSIM METAR API. The default list is `KLEW,KPWM,KBXM`.

## Operations

Build the web app with `npm run build`, then start it with `node bin/radar.mjs`. Stop it with a signal. Start the CLI with `node bin/adsb.mjs`; stop it with Ctrl+C. The web API provides `GET /health`, `GET /api/config`, `GET /api/aircraft`, range-based airport, navaid, airspace, and ILS routes, and WebSocket `/ws`. The WebSocket sends one aircraft JSON object for each feed update. The CLI does not write files.

For browser checks, run `npm run puppeteer`, start the app, then run `npm run screenshots` or `npm run lighthouse`. Build a local container with `docker build -t radar .`. This repository does not deploy the app.

## Commands

- `radar-adsb` reads the default feed at `127.0.0.1:30003`.
- `radar-adsb --host HOST --port PORT` selects a feed host and port.
- `radar-adsb --help` prints usage.
- `radar-adsb --version` prints the package version.
- `radar-adsb --debug` prints aircraft JSON lines.
- `node bin/radar.mjs` starts the web app.

Set `ADSB_HOST` and `ADSB_PORT` to set feed defaults. CLI flags override these settings.

## Exit codes

The CLI uses exit code 0 after `--help`, `--version`, or a normal signal shutdown. It retries feed errors every two seconds and writes each error to standard error. It uses exit code 1 for fatal runtime errors and 2 for invalid options. The CLI writes aircraft data to standard output. It does not print credentials or private settings. Supported platforms are Windows and Linux with Node.js 26. macOS compatibility is inferred and not directly tested.

## Routes

| Method      | Path            | Result                                          |
| ----------- | --------------- | ----------------------------------------------- |
| `GET`       | `/`             | Serves `public/index.html`.                     |
| `GET`       | `/client.js`    | Serves generated `dist/client.js`.              |
| `GET`       | `/style.css`    | Serves the local dashboard style.               |
| `GET`       | `/health`       | Returns server status.                          |
| `GET`       | `/api/config`   | Returns home coordinates and elevation.         |
| `GET`       | `/api/aircraft` | Returns recent aircraft data.                   |
| WebSocket   | `/ws`           | Sends one JSON object for each aircraft update. |
| Other paths | Any path        | Returns HTTP 404.                               |

## Assets

`public/` is the source asset root. Webpack writes the client entry to `dist/client.js` and async chunks to `dist/chunks/`. The server serves those chunks from `/chunks/`. Generated output does not belong in `public/`.

## Development server

Run `npm run build`, then run `node bin/radar.mjs`. The default port is 3000. Set `PORT` to use another valid port. Run `npm run puppeteer` to install Chrome, then run `npm run screenshots` or `npm run lighthouse` while the app runs at `http://127.0.0.1:3000`.

## Build

`npm run build` creates `dist/client.js` from `src/frontend/client-entry.mjs`. The aggregate `npm test` command runs this build.

## Deployment

The Dockerfile supports local use. The release workflow validates an authorized version tag before npm publication. Publication requires the release handoff in [AGENTS.md](AGENTS.md).

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/radar)
- [Bug Reports](https://github.com/eliware/radar/issues)
- [npm](https://www.npmjs.com/package/@eliware/radar)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
