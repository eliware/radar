# Release Notes

## 15.1.0 — 2026-11-03

### Added

- Add a local-only aircraft mode that pauses remote aircraft lookups while all connected clients use it.
- Add a separate B toggle for runway base legs and color flight strips by aircraft source.
- Add `ADSBLOL_REMOTE` to disable app-side ADSB.lol lookups independently of the feeder.
- Add configurable ADSB.lol polling with a 15-second default. Debug logs report query radius and API-key header use without exposing the key.

### Changed

- Send the ADSB.lol API key in the `x-api-key` request header.
- Honor a valid `Retry-After` response header. When missing or invalid, exponential backoff grows to a five-minute maximum.
- Pin readsb to the configured RTL-SDR device.
- Use the package version in all Radar HTTP user-agent strings and their tests.
- Update the NASR database to the 2026-10-29 data.
- Refine 3D viewport culling and projection, and keep remote polling range tied to zoom in tilted views.
- Update outdated direct dependencies and refresh the dependency lockfile.
- Expand and update end-user documentation for setup, configuration, CLI, API, and deployment workflows.
- Refactor backend, CLI, frontend, tests, and supporting modules into focused responsibilities without changing their documented behavior.

### Fixed

- Require a browser context with secure-origin APIs for compass tracking.
- Offset the mobile 2D legend from the iOS status area and set wrapped flight-card rows to one-pixel vertical padding.

## 14.0.0 — 2026-10-21

### Added

- Add a responsive web radar with a 2D Canvas fallback and mobile gestures.
- Add desktop and mobile flight strips with compact fields, no headers, and aligned columns.
- Add a responsive ADS-B CLI table and JSON debug output for each aircraft update.
- Add range rings that adapt to radar zoom and omit unit labels.
- Add a passive compass that shows radar heading.
- Add range-based loading for airports and other reference data.
- Add paved runway guides with endpoint elevations and dotted lines.
- Add dotted, color-coded ILS, SID, and STAR paths.
- Add decoded METAR reports for configured stations.
- Add cached aircraft type and flight route lookups.
- Add optional client-side water outlines.
- Add aircraft labels, predicted paths, history marks, and age-based dimming.
- Add callsign retention when later updates contain blank or placeholder values.
- Add stable CLI table borders during redraws and terminal resizing.
- Add aligned radar labels, ring labels, and line gaps.
- Add filters for short or unpaved runways.
- Add a Git LFS copy of NASR data for local deployment.

### Changed

- Pad numeric METAR wind directions to three digits with leading zeros.
