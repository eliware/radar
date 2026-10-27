# ADS-B command-line tool

The ADS-B CLI reads decoded SBS/BaseStation records through TCP. It presents aircraft data in a terminal. It does not decode radio signals.

## Start the command

Use Node.js 26 or later. From a repository checkout, install dependencies with `npm ci`, then run `node bin/adsb.mjs`. The CLI does not require a browser build. The default data endpoint is `127.0.0.1:30003`.

Pass `--host HOST` and `--port PORT` to select a data source. Set `ADSB_HOST` and `ADSB_PORT` for defaults. CLI options override environment values.

The command accepts no positional arguments. Set the TCP endpoint number from 1 through 65535. The command supports Windows and Linux with Node.js 26. macOS support is inferred from Node.js TCP APIs and is not tested directly.

Set `ADSB_LAT` and `ADSB_LON` as decimal latitude and longitude. The CLI uses this point to calculate range and bearing.

| Option        | Default                    | Description                                                            |
| ------------- | -------------------------- | ---------------------------------------------------------------------- |
| `--host HOST` | `ADSB_HOST` or `127.0.0.1` | TCP host name or IP address.                                           |
| `--port PORT` | `ADSB_PORT` or `30003`     | TCP port number, an integer from 1 through 65535.                      |
| `--debug`     | Off                        | Write one JSON object for each parsed aircraft update. Hide the table. |
| `--help`      | —                          | Print usage and exit.                                                  |
| `--version`   | —                          | Print the package version and exit.                                    |

Options accept no positional arguments. `--host` and `--port` require a value after the option. Set both coordinates as valid decimal degrees. See [Runtime configuration](configuration.md) for environment settings.

## Read the table

The CLI sorts aircraft by range. The closest aircraft appear first. The table uses the full terminal width and redraws every second. Resize the terminal to update the layout.

The table lists callsign, ICAO address, altitude, speed, heading, vertical rate, squawk, location, range, bearing, and age. It uses shorter headers and more value rows on narrow terminals.

The CLI keeps the last valid callsign if a later record has no callsign or a placeholder. It lists the ICAO address until it receives a valid callsign. It removes aircraft after two minutes without an update.

Range uses nautical miles. Bearing uses degrees clockwise from north. This data stream has no aircraft type or route.

## Read JSON updates

Run `node bin/adsb.mjs --debug` to print one JSON object for each aircraft update. Each object contains the parsed SBS fields such as `icao`, `callsign`, `altitudeFeet`, `groundSpeedKnots`, `trackDegrees`, `latitude`, `longitude`, `verticalRateFeetPerMinute`, and `squawk`. When valid home coordinates and aircraft coordinates are available, it also contains `distanceNauticalMiles` and `bearingDegrees`. This mode omits the table.

## Options and errors

Run `node bin/adsb.mjs --help` to show command help. Run `node bin/adsb.mjs --version` to show the app version.

The command writes connection errors to standard error. It retries after two seconds. It exits with code 0 after help, version, or signal shutdown. It exits with code 1 when an error ends the command. It exits with code 2 after invalid options.

## Receiver requirements

Enable SBS/BaseStation TCP output in RTL1090. Use endpoint `30003` unless you configure a different one. Select RTL1090's Table tab and close it as usual if no aircraft appear. Read the [RTL1090 task guide](rtl1090-background.md) for setup steps.
