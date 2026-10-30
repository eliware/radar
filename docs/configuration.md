# Runtime configuration

The web server and CLI read `.env` from the current working directory. Shell variables replace matching `.env` values. Set the working directory to the repository root when running the app as a background process. Do not commit credentials or private `.env` files.

Copy `.env.example` to `.env` and edit the settings you want to change. Most settings are optional. The web app can start without home coordinates. Airport, navaid, airspace, ILS, procedure, and airway routes require both coordinates. A custom NASR path must name a compatible SQLite database.

## Web app and CLI settings

| Variable                   | Default                       | Meaning and accepted values                                                                                                                    |
| -------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                     | `3000`                        | Web server TCP port. Use an integer from 1 to 65535. The app listens on all network interfaces.                                                |
| `LOG_LEVEL`                | `info`                        | Server log level: `error`, `warn`, `info`, `http`, `verbose`, `debug`, or `silly`.                                                             |
| `ADSBLOL_POLL_INTERVAL_MS` | `6000`                        | Interval between remote aircraft queries in milliseconds. Use an integer from 1000 through 300000.                                             |
| `ADSB_HOST`                | `127.0.0.1`                   | Host name or IP address of the SBS/BaseStation TCP source. The web app and CLI use it.                                                         |
| `ADSB_PORT`                | `30003`                       | TCP port number. Use an integer from 1 to 65535.                                                                                               |
| `ADSB_LAT`                 | unset                         | Home or receiver latitude in decimal degrees, from -90 to 90. Set it with `ADSB_LON`. It centers the radar and supports CLI range and bearing. |
| `ADSB_LON`                 | unset                         | Home or receiver longitude in decimal degrees, from -180 to 180. Set it with `ADSB_LAT`.                                                       |
| `ADSB_ALT`                 | `300`                         | Home elevation in feet above mean sea level. Use any finite number. It sets 3D reference placement and feeder location.                        |
| `ADSBLOL_API_KEY`          | unset                         | Optional ADSB.lol re-api key. Radar sends it in the `x-api-key` header for remote aircraft requests. Keep it private.                          |
| `RADAR_DEFAULT_RANGE_NM`   | `20`                          | Initial radar range in nautical miles. Use a number from 1 through 300.                                                                        |
| `RADAR_DEFAULT_ROTATION`   | `0`                           | Initial radar heading in degrees clockwise from north. Use an integer from 0 through 359.                                                      |
| `NASR_DATABASE_PATH`       | Repository `nasr/NASR.sqlite` | Optional path to an FAA NASR SQLite database. A custom path must exist. See [FAA NASR data](nasr-data.md).                                     |
| `METAR_STATIONS`           | `KLEW,KPWM,KBXM`              | Comma-separated ICAO airport codes. Entries become uppercase. Invalid codes are ignored and duplicates are removed.                            |

With `LOG_LEVEL=debug`, Radar logs each ADSB.lol query, its radius, and the `x-api-key` header status. The key value stays out of logs.

The web app validates ports, location values, elevation, radar defaults, and the ADSB.lol poll interval before opening connections. Without home coordinates, reference-data routes return HTTP 503. One missing location value or an invalid value stops startup with an error.

The CLI uses `ADSB_HOST`, `ADSB_PORT`, `ADSB_LAT`, and `ADSB_LON`. `--host` and `--port` override the environment defaults. See [ADS-B command-line tool](adsb-cli.md) for options and exit codes.

## Optional feeder settings for Docker Compose

Docker Compose uses these values for feeder containers. The web app and CLI do not use them. The web app uses `ADSBLOL_API_KEY` for remote aircraft requests. See [Linux Compose deployment](linux-compose.md).

| Variable            | Meaning                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| `READSB_DEVICE`     | RTL-SDR serial number or device index passed to readsb. Compose requires a value. |
| `ADSBX_SITENAME`    | Optional receiver label. The default is `Home Roof`.                              |
| `ADSBX_UUID`        | Stable receiver UUID. Create it once with `uuidgen` and keep it.                  |
| `PIAWARE_FEEDER_ID` | Stable feeder ID assigned by FlightAware.                                         |
| `ADSBLOL_UUID`      | Stable UUID for the ADSB.lol feeder. Create it once and keep it.                  |
| `FR24_KEY`          | Flightradar24 sharing key. Only required for its optional `fr24` profile.         |
| `TZ`                | Optional timezone for feeder containers. The default is `UTC`.                    |

The Docker Compose guide explains how to get feeder IDs and keys. Do not commit real keys or private configuration files.
