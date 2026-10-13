# FAA NASR Data

Radar reads airport and runway records from the FAA NASR SQLite database. The server opens the database in read-only mode.

Place the SQLite file at `artifacts/nasr/NASR_2026_10_01.sqlite`, or set `NASR_DATABASE_PATH` in `.env` to its full path. Keep the database out of Git.

The server reads airport records from `APT_BASE`, runway ends from `APT_RWY_END`, airport class flags from `CLS_ARSP`, VOR records from `NAV_BASE`, and ARTCC boundary points from `ARB_SEG`. It serves airports, navaids, and ARTCC paths by distance band. Each route needs `MY_LOCATION`.

The browser loads airports from 0 to 20 nautical miles when it starts. It asks only for the next distance band after a zoom-out. It keeps each result in memory. It does not load the full 300-mile area at startup.

The radar shows public-use airports with a four-character ICAO code that starts with K. Each airport must have an asphalt or concrete runway at least 1,000 feet long. It draws only runways with these surfaces. Airport labels sit above their marker dots. Runway lines use each runway end's NASR elevation. Each dark gray dotted centerline extension runs 10 nautical miles and rises to 3,000 feet above its runway end. Each dotted base leg sits at that extension's end altitude.

VOR, VOR/DME, and VORTAC symbols and identifiers use blue.

NASR has flags for Class B, C, and D airports, but it has no class boundary geometry. The 3D radar shows approximate layered shapes. Class B uses 10, 20, and 30-mile layers up to 10,000 feet MSL. Class C uses a 5-mile core and a 5-to-10-mile shelf. Class D uses a 5-mile radius up to 2,500 feet above the airport. These shapes are visual guides, not official boundaries. NASR has actual ARTCC boundary points in `ARB_SEG`. It does not have Portland approach or A90 boundary points.

NASR lists active ILS localizer courses and glide-slope angles. Radar draws a 10-nautical-mile dotted dim-orange course guide from the glide-slope site without text labels. It draws marker beacon locations as small hollow dim-orange circles. The 3D view follows the published glide-slope angle. The Canvas view keeps the line flat. The database does not give every leg of an instrument approach, so these lines are visual guides.

NASR lists SID and STAR fixes in `DP_RTE` and `STAR_RTE`. Radar loads routes by distance band through `GET /api/procedures`. SIDs use dotted dim-blue lines. STARs use dotted dim-orange lines. Each fix uses a small hollow pyramid. SID labels show the route endpoint. STAR labels show transition entries, common arrival fixes, and route endpoints. These lines use similar brightness, slightly above the dark-gray runway guides. The database does not list crossing altitudes, so Radar draws these routes at the home altitude in 3D.
