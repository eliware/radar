# Release Notes

## 15.0.1 — 2026-10-27

### Added

- Add a local-only aircraft mode that pauses remote polling while all connected clients use it.
- Add a separate B toggle for runway base legs and color flight strips by aircraft source.

### Changed

- Pin readsb to the configured RTL-SDR device.
- Update lookup user-agent version strings to Radar 15.0.1.
- Update shared Eliware packages, dotenv, Puppeteer, and webpack.
- Expand end-user setup, configuration, CLI, API, and deployment documentation.
- The root README and repository guidance contain only convention-required information.
- Use camera frustum intersections to limit 3D reference data and omit overlays behind the camera.
- Keep remote polling range tied to zoom when the 3D view tilts.
- Set wrapped flight-card rows to one-pixel vertical padding and offset the mobile 2D legend from the iOS status area.

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
