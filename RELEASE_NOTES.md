# Release Notes

## 15.0.0 — 2026-10-21

### Changed

- Set 3D reference loading from camera frustum limits and skip overlays outside camera depth.
- Keep remote aircraft polling tied to zoom while the 3D camera tilts.

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
