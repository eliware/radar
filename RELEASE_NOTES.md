# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Add a responsive web radar with a 2D Canvas fallback and mobile gestures.
- Add flight strips for desktop and mobile layouts.
- Add NASR airport, runway, navaid, airspace, ILS, SID, and STAR data.
- Add decoded METAR reports for configured stations.
- Add cached aircraft type and flight route lookups.
- Add optional client-side water outlines.
- Add a passive compass that shows radar heading.
- Add aircraft labels, predicted paths, history marks, and age-based dimming.
- Add a Git LFS copy of the NASR database for local deployment.

### Changed

- Add the ADS-B CLI with a responsive table and JSON debug output.
- Use responsive flight strips with compact values and no field headers.
- Use range rings that adapt to radar zoom and show labels without units.
- Replace the radar control buttons and joystick with a compass.
- Load airports and other reference data only as the radar range expands.
- Show qualifying paved runways with endpoint elevations and dotted runway guides.
- Make ILS, SID, and STAR paths dotted, color-coded radar guides.
- Upgrade repository checks to Convention 12.

### Fixed

- Keep aircraft callsigns when later data records contain blank or placeholder values.
- Keep CLI table borders stable during full-screen redraws and terminal resizing.
- Align flight-card columns at supported viewport widths.
- Align radar labels, ring labels, and line gaps with their displayed geometry.
- Filter out short or unpaved runways from runway guide displays.
- Keep the radar view usable when WebGL is unavailable.
