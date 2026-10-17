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

Document supported workflows, runtime settings, and how to start and stop the app.
After commits to the running app, run `docker compose up -d --build` on Linux and check `/health` and `/ready`.
If the app is unavailable, report that it did not start.

## Application

Keep implementation under `src/` and launchers under `bin/`. Validate settings before opening connections. Make shutdown repeatable.
Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Avoid repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Document installation, commands, options, defaults, errors, and exit codes. Support `--help` and `--version`.

## Web

Document routes, assets, ports, build output, and browser checks. Keep public assets in `public/`. Build output goes to `dist/`.
