# AGENTS.md

## Project

Maintain the Radar web app and CLI for ADS-B data.

## Scope and boundaries

Apply these rules across this repository.

## Layout

Keep source in `src/`, launchers in `bin/`, and tests in `tests/`. Keep docs in `docs/` and specifications in `specs/`. Put each `.mjs` source file in `src/` and mirror it with one test file under `tests/`.

## Development

Use Node.js 26 or later, npm, and native ESM. Keep each source file under 100 lines and each test file under 200 lines.

## Validation

Run `npm ci`, then `npm test`. Run `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check` for focused checks.

## Security

Keep secrets, tokens, private keys, and credentials out of source and package files.

## Changes

Document supported workflows, runtime settings, startup, shutdown, and operation.
After committing changes that affect the running app, rebuild and restart the active service. For the Linux Compose deployment, run `docker compose up -d --build` and verify `/health` and `/ready`. If the deployment is unavailable, report that it could not be restarted.

## Application

Keep implementation under `src/` and launchers under `bin/`. Validate settings before opening connections. Make shutdown repeatable.

## CLI

Document installation, commands, options, defaults, errors, and exit codes. Support `--help` and `--version`.

## Web

Document routes, assets, ports, build output, and browser checks. Keep public assets in `public/`. Build output goes to `dist/`.
