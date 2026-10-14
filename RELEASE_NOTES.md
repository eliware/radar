# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Add a responsive web radar with a 2D Canvas fallback and mobile gestures.
- Add flight strips for desktop and mobile layouts.
- Add NASR airport, runway, navaid, airspace, ILS, SID, and STAR data.
- Add decoded METAR reports for configured stations.
- Add cached aircraft type and flight route lookups.
- Add optional client-side water outlines.
- Add a passive compass that shows radar rotation.
- Add aircraft labels, predicted paths, history marks, and age-based dimming.
- Add a Git LFS copy of the NASR database to the npm package.

### Changed

- Add the ADS-B CLI with a responsive table and JSON debug output.
- Use responsive flight strips with compact values and no field headers.
- Use range rings that adapt to radar zoom and display labels without units.
- Use a compass in place of the old radar control buttons and joystick.
- Load airports and other reference data only as the radar range expands.
- Show qualifying paved runways with endpoint elevations and dotted approach guides.
- Draw ILS, SID, and STAR paths as dotted, color-coded radar guides.
- Upgrade repository checks to Convention 12.

### Fixed

- Keep aircraft callsigns when later feed records contain blank or placeholder values.
- Keep CLI table borders stable during full-screen redraws and terminal resizing.
- Align flight strip columns at supported viewport widths.
- Align radar labels, ring labels, and line gaps with their displayed geometry.
- Filter out short or unpaved runways from runway guide displays.
- Keep the radar display usable when WebGL is unavailable.
