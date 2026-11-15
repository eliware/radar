# Runtime configuration

The web server reads `.env` from the current working directory. Shell variables replace matching `.env` values. Set the working directory to the repository root when running the app as a background process. Do not commit credentials or private `.env` files.

Copy `.env.example` to `.env` and edit the settings you want to change. Most settings are optional. The web app can start without home coordinates. Airport, navaid, airspace, ILS, procedure, and airway routes require both coordinates. A custom NASR path must name a compatible SQLite database.

## Web app settings

| Variable                   | Default                       | Required                                 | Meaning and accepted values                                                                                                     |
| -------------------------- | ----------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                     | `1390`                        | No                                       | Web server TCP port. Use an integer from 1 to 65535. The app listens on all network interfaces.                                 |
| `LOG_LEVEL`                | `info`                        | No                                       | Server log level: `error`, `warn`, `info`, `http`, `verbose`, `debug`, or `silly`.                                              |
| `ADSBLOL_REMOTE`           | `true`                        | No                                       | Set to `false` to stop Radar's ADSB.lol re-api aircraft lookups. The separate ADSB.lol feeder remains unaffected.               |
| `ADSBLOL_POLL_INTERVAL_MS` | `15000`                       | No                                       | Interval between remote aircraft queries in milliseconds. Use an integer from 1000 through 300000.                              |
| `ADSB_HOST`                | `127.0.0.1`                   | No                                       | Host name or IP address of the SBS/BaseStation TCP source.                                                                      |
| `ADSB_PORT`                | `30003`                       | No                                       | TCP port number. Use an integer from 1 to 65535.                                                                                |
| `ADSB_LAT`                 | Unset                         | No for app startup. Required by Compose. | Home or receiver latitude in decimal degrees, from -90 to 90. Set it with `ADSB_LON`. It centers the radar and feeder location. |
| `ADSB_LON`                 | Unset                         | No for app startup. Required by Compose. | Home or receiver longitude in decimal degrees, from -180 to 180. Set it with `ADSB_LAT`.                                        |
| `ADSB_ALT`                 | `300`                         | No for app startup. Required by Compose. | Home elevation in feet above mean sea level. Use any finite number. It sets 3D reference placement and feeder location.         |
| `ADSBLOL_API_KEY`          | Unset                         | No                                       | Optional ADSB.lol re-api key. Radar sends it in the `x-api-key` header for remote aircraft requests. Keep it private.           |
| `RADAR_DEFAULT_RANGE_NM`   | `20`                          | No                                       | Initial radar range in nautical miles. Use a number from 1 through 300.                                                         |
| `RADAR_DEFAULT_ROTATION`   | `0`                           | No                                       | Initial radar heading in degrees clockwise from north. Use an integer from 0 through 359.                                       |
| `NASR_DATABASE_PATH`       | Repository `nasr/NASR.sqlite` | No                                       | Optional path to an FAA NASR SQLite database. A custom path must exist. See [FAA NASR data](nasr-data.md).                      |
| `METAR_STATIONS`           | `KLEW,KPWM,KBXM`              | No                                       | Comma-separated ICAO airport codes. Entries become uppercase. Invalid codes are ignored and duplicates are removed.             |

With `LOG_LEVEL=debug`, Radar logs each ADSB.lol query, its radius, and the `x-api-key` header status. The key value stays out of logs.

The web app validates ports, location values, elevation, radar defaults, and the ADSB.lol poll interval before opening connections. Without home coordinates, reference-data routes return HTTP 503. One missing location value or an invalid value stops startup with an error.

## Feeder settings for Docker Compose

Docker Compose uses these values for feeder containers. `ADSB_LAT`, `ADSB_LON`, and `ADSB_ALT` above are required by the default feeder stack. The web app uses `ADSBLOL_API_KEY` for remote aircraft requests. See [Linux Compose deployment](linux-compose.md).

| Variable            | Default     | Required               | Meaning                                                                         |
| ------------------- | ----------- | ---------------------- | ------------------------------------------------------------------------------- |
| `READSB_DEVICE`     | Unset       | Yes                    | RTL-SDR serial number or device index passed to readsb.                         |
| `ADSBX_SITENAME`    | `Home Roof` | No                     | Optional ADSBX receiver label.                                                  |
| `ADSBX_UUID`        | Unset       | Yes                    | Stable ADSBX receiver UUID. Create it once with `uuidgen` and keep it.          |
| `PIAWARE_FEEDER_ID` | Unset       | Yes                    | Stable feeder ID assigned by FlightAware.                                       |
| `ADSBLOL_UUID`      | Unset       | Yes                    | Stable UUID for the ADSB.lol feeder. Create it once with `uuidgen` and keep it. |
| `FR24_KEY`          | Empty       | Required after signup. | Flightradar24 sharing key.                                                      |
| `TZ`                | `UTC`       | No                     | Timezone for feeder containers.                                                 |

The Docker Compose guide explains how to get feeder IDs and keys. Do not commit real keys or private configuration files.
