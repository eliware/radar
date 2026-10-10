# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

@eliware/radar [![npm](https://img.shields.io/npm/v/@eliware/radar)](https://www.npmjs.com/package/@eliware/radar) [![License](https://img.shields.io/github/license/eliware/radar)](https://github.com/eliware/radar/blob/main/LICENSE) [![CI](https://github.com/eliware/radar/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/radar/actions/workflows/ci.yaml)

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
- [License](#license)
- [Links](#links)

## Features

Purpose: Radar is an aviation tracking app for ADS-B data from RTL-SDR receivers. The package provides a web app and a CLI feed reader. Package description: Aviation tracking app and real-time ADS-B CLI for RTL-SDR receivers. Author: Eliware <eliware@eliware.org>. License: MIT.

The Fastify web app serves a Three.js local space, a 2D Canvas fallback, an aircraft REST API, and a WebSocket feed. The CLI reads decoded aircraft records from an SBS/BaseStation TCP feed and shows them as live flight strips. Both apps retry the feed after errors.

## Requirements

Use Node.js 26 and npm. CI validates on Ubuntu. We directly validate changes on Windows when noted in the change record. We infer macOS support from Node.js APIs; we do not claim direct macOS validation.

## Setup

Run `npm ci` in a checkout. Copy `.env.example` to an untracked `.env` only when you need custom settings. Run `npm run build` before you start the web app.

After npm publication, install the package with `npm install --global @eliware/radar`. From a checkout, run `node bin/adsb.mjs`.

## Usage

Run `node bin/radar.mjs` to serve the web app on port 3000. The server listens on `0.0.0.0`. Open `http://localhost:3000` on this computer. Use the computer's Wi-Fi IPv4 address on a phone on the same network. The app reads the feed at `127.0.0.1:30003`. Run `node bin/adsb.mjs` to start the CLI. The CLI shows live flight strips. Add `--debug` to print aircraft JSON lines. Use `--host` and `--port` to select another feed.

The package version in `package.json` is the release version. Releases use matching `vMAJOR.MINOR.PATCH` tags. After an authorized release, verify the version with `npm view @eliware/radar@VERSION version`.

## Development

Read [AGENTS.md](AGENTS.md), [specs/README.md](specs/README.md), and [RELEASE_NOTES.md](RELEASE_NOTES.md) before changes. Each source module has one matching test in the same folder tree. Documentation: [docs](docs/README.md) · [specifications](specs/README.md)

## Testing

Run `npm test` for Jest, lint, format checks, audit, package checks, and the web build. Run `npm run pack` to validate the npm archive. Run `npm run format:check` for a read-only format check. CI runs `npm ci` and `npm test`.

## Troubleshooting

If the web app does not start, check that Node.js 26 is installed and `PORT` is an integer from 1 through 65535. If the app or CLI cannot connect, check `ADSB_HOST`, `ADSB_PORT`, and the receiver feed. Both clients retry after two seconds. RTL1090 must enable SBS/BaseStation TCP output on port 30003.

## Security

The web app serves local assets and a local aircraft API. The API has no authentication. Keep access to the local network controlled. The server and CLI read the configured receiver feed. Radar does not write persistent data. Keep `.env`, credentials, tokens, and private keys out of version control and package files.

## Configuration

Runtime settings come from environment variables or an untracked `.env` file. `PORT` defaults to 3000 and accepts integers from 1 through 65535. `LOG_LEVEL` defaults to `info`. `ADSB_HOST` defaults to `127.0.0.1`. `ADSB_PORT` defaults to 30003 and accepts integers from 1 through 65535. Set optional `MY_LOCATION` as decimal latitude and longitude, separated by a comma. Set `MY_ELEVATION` in feet above mean sea level; it defaults to 300. CLI flags `--host` and `--port` override feed settings. Start the web app with `node bin/radar.mjs`; stop it with a process signal. Start the CLI with `node bin/adsb.mjs`; stop it with Ctrl+C. The web API provides `GET /health`, `GET /api/config`, `GET /api/aircraft`, and WebSocket `/ws`. The WebSocket sends one aircraft JSON object for each feed update.

## Operations

Build the web app with `npm run build`, then start it with `node bin/radar.mjs`. Use signal shutdown to stop it. Start the CLI with `node bin/adsb.mjs`; use Ctrl+C to stop it. User workflows include REST health checks, aircraft list reads, WebSocket updates, and CLI flight strips. The operational boundary is the configured local feed and local web assets. The CLI does not write files. For browser checks, run `npm run puppeteer`, start the web app, then run `npm run screenshots` or `npm run lighthouse`. Build a local container with `docker build -t radar .`. This repository does not deploy the app.

## Commands

Install from npm after release with `npm install --global @eliware/radar`. From a checkout, install dependencies with `npm ci`.

- `radar-adsb` reads the default feed at `127.0.0.1:30003`.
- `radar-adsb --host HOST --port PORT` selects a feed host and port.
- `radar-adsb --help` prints usage.
- `radar-adsb --version` prints the package version.
- `radar-adsb --debug` prints aircraft JSON lines.
- `node bin/radar.mjs` starts the web app.

Set `ADSB_HOST` and `ADSB_PORT` to set feed defaults. CLI flags override these settings. The CLI does not change or delete data, so it does not need a dry-run option or confirmation. Supported platforms: Windows and Linux with Node.js 26. Validation evidence: this change runs tests on Windows, and CI targets Ubuntu. We infer macOS compatibility from Node.js TCP APIs; we have not directly validated it.

## Exit codes

The CLI uses exit code 0 after `--help`, `--version`, or a normal signal shutdown. It retries feed errors every two seconds and writes each error to standard error. It uses exit code 1 for a fatal runtime error and 2 for invalid options. The CLI writes aircraft data to standard output. It does not print credentials or private settings. Validation evidence: this change runs tests on Windows, and CI targets Ubuntu. macOS compatibility is inferred and not directly tested.

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

`public/` is the source asset root. `dist/client.js` is generated by webpack and served at `/client.js`. Generated output does not belong in `public/`.

## Development server

Run `npm run build`, then run `node bin/radar.mjs`. The default port is 3000. Set `PORT` to use another valid port. Run `npm run puppeteer` to install Chrome, then run `npm run screenshots` or `npm run lighthouse` while the app runs at `http://127.0.0.1:3000`.

## Build

`npm run build` creates `dist/client.js` from `src/frontend/client-entry.mjs`. The aggregate `npm test` command runs this build.

## Deployment

The repository owns the app and Dockerfile. The Dockerfile supports local use. A release workflow publishes the npm package after an authorized version tag. Publication requires the release handoff in [AGENTS.md](AGENTS.md).

## Support

For help or discussion, join the Eliware community:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[license](LICENSE)

## Links

- [docs](docs/README.md)
- [specifications](specs/README.md)
- [Release Notes](RELEASE_NOTES.md)
- [npm Package](https://www.npmjs.com/package/@eliware/radar)
- [Home Page](https://github.com/eliware/radar#readme)
- [GitHub repository](https://github.com/eliware/radar.git)
- [Eliware](https://eliware.org)
- [GitHub organization](https://github.com/eliware)
- [Discord](https://discord.gg/M6aTR9eTwN)
