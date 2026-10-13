# AGENTS.md

## Project

Repository: `eliware/radar`. Purpose: provide a web app and a CLI for ADS-B aircraft data.

## Scope and boundaries

Scope: this repository owns Radar code, tests, package metadata, documentation, and local build files. It does not own production credentials, publication decisions, or deployment execution. These instructions apply repository-wide. Subdirectory instructions apply only within their subdirectories. A subdirectory AGENTS.md can add narrower rules.

## Layout

Required structure: `bin/radar.mjs` starts the Fastify web app. `bin/adsb.mjs` starts the ADS-B CLI. Put source modules in `src/cli/`, `src/frontend/`, `src/backend/`, or `src/shared/`. Put tests in matching folders under `tests/`.

## Development

These Development instructions apply repository-wide. Subdirectory AGENTS.md instructions apply within their subdirectories. Use Node.js 26, npm, and native ESM `.mjs` modules. Before edits, read the root README.md, applicable AGENTS.md instructions, and applicable documentation relevant to the change. Keep executable entrypoints under `bin/`, source under `src/`, docs under `docs/`, and one mirrored test under `tests/`. Put CLI modules in `src/cli/`, browser modules in `src/frontend/`, server modules in `src/backend/`, and shared CLI/server modules in `src/shared/`. Apply single responsibility: give each module one cohesive purpose and one reason to change. Business-logic modules and coordinators are valid, including coordinators of coordinators, when each module does only its own responsibility. Wire each distinct responsibility through a focused submodule and mirrored test. Do not add the new responsibility to an existing module. Refactor them during ordinary review when mixed responsibilities appear. Line maxima are blocking. Passing them does not prove single responsibility or permit mixed responsibilities below applicable maxima. Keep each source module under 100 lines and each test under 200 lines.

## Validation

Run `npm ci`, then `npm test`. Run `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check` for focused checks. Aggregate validation runs tests, lint, format checks, audit, pack checks, conventions, and the web build. Run `npm run pack` to check the npm archive. Require each check to pass before release review.

## Security

Keep secrets, tokens, private keys, and machine-specific values out of version control and package files. Do not log secrets or sensitive payloads.

## Changes

Keep changes actionable, current, and concise. Project-specific instructions can add requirements; they cannot weaken shared rules without authorization. A deviation does not waive any convention ID or validation stage.

## Application

The web entrypoint is `bin/radar.mjs`. It is the executable entrypoint for the web app. The CLI entrypoint is `bin/adsb.mjs`. Both use Node.js 26 and native ESM. Runtime commands are `node bin/radar.mjs` and `node bin/adsb.mjs`. Runtime settings come from `.env` or process environment. Defaults are web port 3000, log level info, feed host 127.0.0.1, feed port 30003, and `MY_ELEVATION` at 300 feet above mean sea level. `MY_LOCATION` uses decimal latitude and longitude. CLI arguments override feed settings only for the CLI. Package metadata does not configure runtime behavior. Validate configuration before opening connections. Make shutdown repeatable. Fastify lifecycle shutdown closes the feed and server after a signal. Use a safe boundary: read the local feed and do not write persistent data. Tests must cover public inputs and externally observable results of every documented workflow. Human review must identify supported workflows that docs or tests omit. Passing tests alone do not prove workflow inventory completeness. Keep the root README, runtime settings docs, and `.env.example` current. Neither app writes persistent data.

## CLI

CLI entrypoint: supported commands are `radar-adsb` and `node bin/adsb.mjs`. The `radar-adsb` command maps to `bin/adsb.mjs`. Command behavior: parse no positional arguments. Parse `--host HOST` and `--port PORT`; default to `ADSB_HOST` and `ADSB_PORT`, then to 127.0.0.1 and 30003. Validate ports from 1 through 65535 before connection. The table redraws every second. The `--debug` option prints one JSON aircraft object per feed update instead of the table. The `--help` option prints usage. The `--version` option prints the package version. Send option errors to standard error and set exit code 2. Write TCP feed errors to standard error, then retry after two seconds. Exit with 0 after help, version, or signal shutdown. Fatal runtime errors exit with code 1. Supported platforms are Windows and Linux with Node.js 26. macOS support is inferred from Node.js TCP APIs and is not directly validated. Validation evidence: run `npm test` on Windows; CI runs it on Ubuntu. The CLI makes no file changes, so it needs no dry-run or confirmation option.

## Web

Web configuration uses `PORT`, which defaults to 3000. The server binds to `0.0.0.0` for local network access. `MY_ELEVATION` defaults to 300 feet above mean sea level. Routes: `GET /` serves `public/index.html`; `GET /style.css` serves `public/style.css`; `GET /client.js` serves `dist/client.js`; `/chunks/:filename` serves async webpack chunks from `dist/chunks/`; `GET /health` reports server status; `GET /api/config` returns location and elevation; `GET /api/aircraft` returns recent aircraft; `GET /api/ils` returns operational ILS data by range; `GET /api/procedures` returns SID and STAR paths by range; `/ws` relays aircraft JSON updates. The API has no authentication. Unknown paths return 404. Keep source assets in `public/`; build output goes to `dist/`. Run `npm run build` to build. Run `npm run puppeteer`, start the app, then run `npm run lighthouse` for browser checks. Docker supports local use; this repository does not deploy the app.

## npm publication

The package is `@eliware/radar`. Read its version from `package.json`. The exact files allowlist is `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `bin/`, and `specs/`. The pack validation command is `npm run pack` (script: `eliware-test --pack`); require it to pass. Publish with npm Trusted Publishing and provenance through `publish.yaml`. After an authorized release, run `npm view @eliware/radar@VERSION version --registry=https://registry.npmjs.org`. Confirm the exact package version matches `package.json`. Eli and the project developer run TagIt preflight together. Eli decides release readiness and instructs DevOps. DevOps executes the authorized release. This section does not authorize publication. Publication requires explicit authorization through the applicable Operations release handoff.
