# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/radar [![License](https://img.shields.io/github/license/eliware/radar)](https://github.com/eliware/radar/blob/main/LICENSE) [![CI](https://github.com/eliware/radar/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/radar/actions/workflows/ci.yaml)

Web-based aviation tracking app for decoded ADS-B data.

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
- [Routes](#routes)
- [Assets](#assets)
- [Development server](#development-server)
- [Build](#build)
- [Deployment](#deployment)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Radar displays aircraft from an SBS/BaseStation TCP stream. Read the [user guides](docs/README.md) for installation and app details.

## Requirements

Use Node.js 26 or later for local operation. Use Git LFS to retrieve the FAA NASR database.

## Setup

Run `npm ci` from the repository root. Run `git lfs pull` to retrieve the database. Copy [.env.example](.env.example) when you want custom settings.

## Usage

Run `npm run build`, then run `node bin/radar.mjs`. Open `http://localhost:1390` by default. Read the [web guide](docs/web-api.md) for setup and controls. See [release notes](RELEASE_NOTES.md) for released changes.

## Development

Read [AGENTS.md](AGENTS.md) before changing files. Use [specifications](specs/README.md) and keep the owning guide current.

## Testing

Run `npm test` for aggregate validation. Run `npm test -- tests/shared/sbs-message.test.mjs` for one focused test file.

## Troubleshooting

Check the [web guide](docs/web-api.md), [configuration guide](docs/configuration.md), or [Compose guide](docs/linux-compose.md) for common setup problems.

## Security

The web API has no authentication. Limit access to a trusted network. Keep credentials and private configuration out of Git.

## Configuration

Set runtime values in `.env` or the process environment. See the [configuration guide](docs/configuration.md) for defaults and validation rules.

## Operations

Use the [Linux Compose guide](docs/linux-compose.md) or the [Windows task guides](docs/README.md#guides) to start and stop Radar.

## Routes

See the [web guide](docs/web-api.md#http-routes) for HTTP routes and the WebSocket endpoint.

## Assets

Radar serves app files from `public/` and browser bundles from `dist/`. See the [asset guide](docs/web-api.md#browser-assets) for routes and output names.

## Development server

Run `npm run build`, then run `node bin/radar.mjs`. The server listens on port `1390` by default.

## Build

Run `npm run build` to create `dist/client.js` and split chunks under `dist/chunks/`.

## Deployment

Deploy with [Docker Compose](docs/linux-compose.md). Use the [Windows task guides](docs/README.md#guides) for scheduled startup.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/radar)
- [Bug Reports](https://github.com/eliware/radar/issues)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
