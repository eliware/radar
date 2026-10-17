# FAA NASR data

Radar reads the FAA NASR SQLite database in read-only mode. The repository tracks `nasr/NASR_2026_10_01.sqlite` with Git LFS. Install Git LFS before cloning. If the checkout contains a 133-byte pointer rather than the database, run `git lfs install` and `git lfs pull` from the repository root. Set `NASR_DATABASE_PATH` to use a different database file.

## Airports and runways

Radar loads airport data by distance from `ADSB_LAT` and `ADSB_LON`. It requests the on-screen range at startup and only the new distance band when you zoom out. Loaded data stays in browser memory. The full 300-nautical-mile area is not loaded at startup.

Radar lists public-use airports with a four-character ICAO code that starts with `K`. Each airport needs an asphalt or concrete runway longer than 1,000 feet. Radar plots only runways that satisfy these rules.

Airport markers use the airport location and elevation. Runway ends use their NASR coordinates and elevations. Radar plots a dotted runway centerline extension to 10 nautical miles from each end. The line reaches 3,000 feet above the runway end. Dotted perpendicular runway legs use that altitude too.

## Navigation aids and airspace

Radar shows VOR, VOR/DME, and VORTAC symbols in blue. It shows FAA ARTCC boundary paths from the NASR `ARB_SEG` table.

NASR has airport flags for Class B, C, and D coverage. It has no boundary shapes for this airspace. Radar plots approximate 3D shapes from standard class dimensions. These shapes are visual guides, not official boundaries. NASR has no A90 TRACON boundaries.

## ILS, SID, and STAR data

NASR lists active ILS localizer and glide-slope data. It also lists marker beacon locations when available. Radar plots a dotted muted-purple course guide and small hollow marker circles. Their brightness is about half the former level and matches SID, STAR, and runway guides.

ILS guides have no text labels. The 3D view follows the published glide-slope angle. The 2D view plots the course on a flat plane.

NASR lists SID and STAR routes and waypoints. Radar plots dotted blue SID paths and dotted muted-orange STAR paths. Hollow pyramids mark route waypoints. Radar labels selected route-entry and route-end waypoints. The database has no crossing altitude for every waypoint. Radar plots these paths at home elevation in 3D.

These procedure lines are visual references. They do not replace official charts or navigation data.
