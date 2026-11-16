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

See the [user guides](docs/README.md) for web features and operations.

## Requirements

Use Node.js 26 or later and Git LFS for the FAA database.

## Setup

Follow [docs/README.md](docs/README.md) to install, configure, and run Radar.

## Usage

Start the [web app](docs/web-api.md). See [release notes](RELEASE_NOTES.md) for released changes.

## Development

Follow [AGENTS.md](AGENTS.md) and the [specifications](specs/README.md) when changing the repository.

## Testing

Run `npm test` for aggregate validation.

## Troubleshooting

Use the [user guides](docs/README.md) to resolve setup and runtime issues.

## Security

The web API has no authentication. Limit access to a trusted network.

## Configuration

Set runtime options in `.env` or the process environment. See [.env.example](.env.example) and [configuration guide](docs/configuration.md).

## Operations

Use the [Linux Compose guide](docs/linux-compose.md) or Windows [web task guide](docs/web-service-background.md) and [receiver guide](docs/rtl1090-background.md).

## Routes

See the [web guide](docs/web-api.md) for HTTP and WebSocket routes.

## Assets

The app serves public files from `public/` and built browser files from `dist/`.

## Development server

Run `npm run build`, then `node bin/radar.mjs`. Open `http://localhost:1390` by default. See the [web guide](docs/web-api.md).

## Build

Run `npm run build` to write the browser bundle to `dist/`.

## Deployment

The `dev` target runs `git pull`, `npm ci`, and `npm test`. The `nas` target also runs `npm run deploy:compose` to build and start the containers.

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
