# AGENTS.md

## Project

Maintain @eliware/radar, Eliware's web app for decoded ADS-B data.

## Scope and boundaries

Apply these instructions to application code, tests, and documentation.

## Layout

Keep source files in `src/` and launchers in `bin/`.
Keep tests in `tests/` and fixtures in `test-fixtures/`.
Keep documentation in `docs/` and specifications in `specs/`.
Keep `webpack.config.mjs` at the repository root.
Mirror each `src/` `.mjs` file with a same-path `tests/` `.test.mjs` file.

## Development

Use Node.js 26 or later, npm, and native ESM.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint` for focused lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep credentials, private data, and runtime state out of tracked files.

## Changes

Keep tests and documentation aligned with behavior changes.

## Application

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## Web

Keep public assets in `public/` and build output in `dist/`.
Document routes, assets, bundles, build settings, ports, and browser checks.
