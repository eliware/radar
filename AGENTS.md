# AGENTS.md

## Project

Repository: `eliware/radar`. Purpose: provide a web app and a CLI for ADS-B aircraft data.

## Scope and boundaries

Scope: this repository owns Radar code, tests, package metadata, documentation, and local build files. It does not own production credentials, publication decisions, or deployment execution. These instructions apply repository-wide. A subdirectory AGENTS.md can add narrower rules for its subdirectory.

## Layout

Required structure: `bin/radar.mjs` starts the web app. `bin/adsb.mjs` starts the ADS-B CLI. `src/` contains implementation modules. `tests/` mirrors each source module. `docs/` contains user documentation. `public/` contains source web assets. `dist/` contains generated web output.

## Development

Use Node.js 26, npm, and native ESM `.mjs` modules. Before changes, read the root README.md, applicable AGENTS.md instructions, and applicable documentation relevant to the change. These Development rules apply repository-wide. A subdirectory AGENTS.md can add stricter rules. Required repository structure: executable entrypoints under `bin/`, implementation under `src/`, documentation under `docs/`, and one matching test under `tests/`. Apply single responsibility: give each module one cohesive purpose and one reason to change. Business-logic modules and coordinators are valid, including coordinators of coordinators, when each module does only its own responsibility. Wire each distinct responsibility through a focused submodule and its mirrored test; do not add the new responsibility to an existing module. Refactor them during ordinary review when modules mix responsibilities. Line maxima are blocking, but passing them does not prove single responsibility or permit mixed responsibilities. Keep every `src/*.mjs` file under 100 lines and add exactly one matching `tests/*.test.mjs` file. Keep each test file under 200 lines.

## Validation

Run `npm ci`, then `npm test`. Aggregate validation runs tests, lint, format checks, audit, pack checks, and the web build. Run `npm run pack` to check the npm archive. Require each check to pass before release review.

## Security

Keep secrets, tokens, private keys, and machine-specific values out of version control and package files. Do not log secrets or sensitive payloads.

## Changes

Keep changes actionable, current, and concise. Project-specific instructions can add requirements; they cannot weaken shared rules without authorization. A deviation does not waive any convention ID or validation stage. Do not publish, release, deploy, or change an external system without explicit authorization through its Operations handoff.

## Application

The web entrypoint is `bin/radar.mjs`. It loads `.env`, validates `PORT`, starts the HTTP server, and supports repeatable signal shutdown. The CLI loads `.env` and validates feed configuration before it opens a TCP connection. Environment settings are `PORT`, `LOG_LEVEL`, `ADSB_HOST`, `ADSB_PORT`, and optional `MY_LOCATION`. Optional defaults are port 3000, log level info, host 127.0.0.1, and feed port 30003. `MY_LOCATION` uses decimal latitude and longitude. `.env.example` lists optional settings. The web app serves local assets. The CLI reads decoded SBS/BaseStation records. Its operational boundary is the configured local feed. Neither app writes persistent data. Tests must cover documented user workflows.

## CLI

CLI entrypoint: supported commands are `radar-adsb` and `node bin/adsb.mjs`. The `radar-adsb` command maps to `bin/adsb.mjs`. Command behavior: parse no positional arguments. Parse `--host HOST` and `--port PORT`; default to `ADSB_HOST` and `ADSB_PORT`, then to 127.0.0.1 and 30003. Validate ports from 1 through 65535 before connection. The `--help` option prints usage. The `--version` option prints the package version. Send option errors to standard error and set exit code 2. Write TCP feed errors to standard error, then retry after two seconds. Exit with 0 after help, version, or signal shutdown. Fatal runtime errors exit with code 1. Supported platforms are Windows and Linux with Node.js 26. macOS support is inferred from Node.js TCP APIs and is not directly validated. Validation evidence: run `npm test` on Windows; CI runs it on Ubuntu. The CLI makes no file changes, so it needs no dry-run or confirmation option.

## Web

Web configuration uses `PORT`, which defaults to 3000. Routes: `GET /` serves `public/index.html`; `GET /client.js` serves `dist/client.js`. Other paths return 404; other methods return 405. Keep source assets in the public root `public/`; build output goes to `dist/client.js`. Run `npm run build` to build. Run `npm run puppeteer`, start the app, then run `npm run lighthouse` for browser validation. Docker supports local use; this repository does not deploy the app.

## npm publication

The package is `@eliware/radar`. Read its version from `package.json`. The exact files allowlist is `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, and `bin/`. The pack validation command is `npm run pack` (script: `eliware-test --pack`); require it to pass. Publish with npm Trusted Publishing and provenance through `publish.yaml`. After an authorized release, run `npm view @eliware/radar@VERSION version --registry=https://registry.npmjs.org`. Confirm the exact package version matches `package.json`. Eli and the project developer run TagIt preflight together. Eli decides release readiness and instructs DevOps. DevOps executes the authorized release. This section does not authorize publication. Use the applicable Operations handoff for release authorization.
