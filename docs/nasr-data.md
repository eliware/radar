# FAA NASR data

Radar reads the FAA NASR SQLite database in read-only mode. The repository tracks `nasr/NASR_2026_10_01.sqlite` with Git LFS. Install Git LFS before cloning. If the checkout contains a 133-byte pointer instead of the database, run `git lfs install` and `git lfs pull` from the repository root. Set `NASR_DATABASE_PATH` to use another database file.

## Airports and runways

Radar loads airport data by distance from `ADSB_LAT` and `ADSB_LON`. It requests the visible range at startup. It requests only the new distance band when you zoom out. It keeps loaded data in browser memory. It does not load the full 300 nautical mile area at startup.

Radar shows public-use airports with a four-character ICAO code that starts with `K`. Each displayed airport must have an asphalt or concrete runway longer than 1,000 feet. Radar draws only runways that meet these rules.

Airport markers use the airport location and elevation. Runway ends use their NASR coordinates and elevations. Radar draws a dotted runway centerline extension that reaches 10 nautical miles from each end. The line reaches 3,000 feet above the runway end. Radar draws dotted base legs at the same altitude.

## Navigation aids and airspace

Radar shows VOR, VOR/DME, and VORTAC symbols in blue. It shows FAA ARTCC boundary paths from the NASR `ARB_SEG` table.

NASR has airport flags for Class B, C, and D service. It does not have these airspace boundary shapes. Radar draws approximate 3D shapes from common class dimensions. These shapes are visual guides, not official boundaries. NASR does not provide A90 approach boundaries.

## ILS, SID, and STAR data

NASR provides active ILS localizer and glide-slope data. It also provides marker beacon locations when available. Radar draws a dotted dim-purple course guide and small hollow marker circles, at about half the previous brightness and near the SID, STAR, and runway-guide brightness. It does not draw text labels for the ILS guides. The 3D view follows the published glide-slope angle. The 2D view draws the course on a flat plane.

NASR lists SID and STAR routes and fixes. Radar draws dotted blue SID paths and dotted dim-orange STAR paths. Hollow pyramids mark route fixes. Radar labels selected transition and route end fixes. The database does not provide crossing altitudes for every fix. Radar draws these paths at home elevation in 3D.

These procedure lines are visual references. They do not replace official charts or navigation data.
