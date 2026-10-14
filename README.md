# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/radar [![License](https://img.shields.io/github/license/eliware/radar)](https://github.com/eliware/radar/blob/main/LICENSE) [![CI](https://github.com/eliware/radar/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/radar/actions/workflows/ci.yaml)

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

Radar provides a web app and a CLI for ADS-B aircraft data. Read the [web guide](docs/web-api.md) and [CLI guide](docs/adsb-cli.md).

## Requirements

Use Node.js 26 or later. Use Git LFS to clone the source repository.

## Setup

Read the [user guides](docs/README.md) to install and configure Radar.

## Usage

Use the [web guide](docs/web-api.md) or [CLI guide](docs/adsb-cli.md) to start Radar. Read the [release notes](RELEASE_NOTES.md) for released changes.

## Development

Read [AGENTS.md](AGENTS.md) and [specifications](specs/README.md) before you change the source.

## Testing

Run `npm test` to validate the repository.

## Troubleshooting

Use the [user guides](docs/README.md) to check the feed, web app, and receiver.

## Security

The web API has no authentication. Limit access to a trusted network.

## Configuration

Set runtime options in `.env` or in the process environment. See [.env.example](.env.example).

## Operations

Read the [web task guide](docs/web-service-background.md) and [RTL1090 task guide](docs/rtl1090-background.md) for Windows setup.

## Commands

- `node bin/adsb.mjs` starts the CLI.
- `node bin/adsb.mjs --help` shows CLI options.
- `node bin/adsb.mjs --version` shows the app version.

## Exit codes

The CLI returns code 0 after help, version, or signal shutdown. It returns code 1 after a fatal error. It returns code 2 after invalid options.

## Routes

Read the [web guide](docs/web-api.md) for the REST and WebSocket routes.

## Assets

The app serves assets from `public/`. The build writes browser files to `dist/`.

## Development server

Run `npm run build`, then run `node bin/radar.mjs`. Read the [web guide](docs/web-api.md) for browser checks.

## Build

Run `npm run build` to build the browser app.

## Deployment

When a push targets the `dev` deployment, it pulls `main`, installs dependencies with `npm ci`, and runs `npm test`. It does not start or publish the app.

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
