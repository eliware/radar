# AGENTS.md

## Project

Maintain @eliware/radar, Eliware's web app and CLI for decoded ADS-B data.

## Scope and boundaries

Apply these instructions to this repository's application, CLI, tests, and documentation.

## Layout

Keep source in `src/`, launchers in `bin/`, tests in `tests/`, fixtures in `test-fixtures/`, docs in `docs/`, and specifications in `specs/`. Keep `webpack.config.mjs` at the repository root. Mirror each `src/` `.mjs` file with one same-path `tests/` `.test.mjs` file.

## Development

Use Node.js 26 or later, npm, and native ESM. Keep repository documentation current with maintained behavior and workflows.

## Validation

Run `npm test` for aggregate validation. Run `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check` for focused checks.

## Security

Keep credentials and private data out of tracked files.

## Changes

Keep tests and documentation aligned with behavior changes.

## Application

Validate configuration before opening connections. Make shutdown repeatable.

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Keep command behavior, options, defaults, help, and exit codes documented in the user guides.

## Web

Keep public assets in `public/` and build output in `dist/`. Document routes, assets, bundles, build settings, ports, and browser checks.
