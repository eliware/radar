# Release Notes

## 15.1.0 — 2026-11-15

### Added

- Add an app-side ADSB.lol API key in the `x-api-key` header. Add a configurable polling interval and request logs that confirm key use without showing the key.
- Add `ADSBLOL_REMOTE` to disable app lookups while the feeder keeps running.
- Honor `Retry-After` when ADSB.lol rate limits a request. Use exponential backoff with a five-minute maximum when the response has no valid retry time.
- Add local-only aircraft mode, separate runway base-leg visibility, and source-based flight-strip colors.
- Use aircraft-shaped diamonds for history marks. Keep them for two minutes and fade them with age.

### Changed

- Update the NASR database to the 2026-10-29 release and document its import and indexing workflow.
- Use the package version in Radar request user-agent strings and their tests.
- Keep aircraft, airport references, runways, procedures, and other overlays in sync while the 3D camera moves.
- Make ADSB.lol polling configurable, default it to 15 seconds, and keep remote polling radius tied to the current radar view.
- Update @eliware/common and outdated direct dependencies. Refresh the lockfile and align package metadata with version 15.
- Expand end-user setup, configuration, API, deployment, and feeder documentation.
- Refactor application, test, and support modules into focused responsibilities while preserving documented behavior.

### Fixed

- Show the source of each remote aircraft. Local-only mode immediately removes saved remote targets and trails.
- Validate remote aircraft addresses and coordinates before accepting records.
- Set perpendicular runway marks 10 nautical miles from extension ends.
- Set water tile rows to valid polar indices. Support radar shutdown and aircraft updates, and use the browser fallback when WebGL cannot start.
- Require HTTPS or localhost for compass tracking. Refine the mobile legend and flight-strip layout.

### Breaking changes

- Remove the ADS-B terminal CLI and its supporting tests, documentation, and specifications.

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
