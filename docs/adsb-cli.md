# ADS-B command-line tool

The `radar-adsb` command reads decoded SBS/BaseStation records from a TCP feed. It shows aircraft data in a terminal. It does not decode radio signals.

## Start the command

Run `radar-adsb` after you install the npm package. From a source checkout, run `node bin/adsb.mjs`. The default feed address is `127.0.0.1:30003`.

Use `--host HOST` and `--port PORT` to select a feed. Set `ADSB_HOST` and `ADSB_PORT` to set default values. A CLI option takes priority over an environment value.

The command accepts no positional arguments. Set a port from 1 through 65535. The command supports Windows and Linux with Node.js 26. macOS support is inferred from Node.js TCP APIs and is not tested directly.

Set `MY_LOCATION` as decimal latitude and longitude, separated by a comma. The CLI uses this point to calculate range and bearing.

## Read the table

The CLI sorts aircraft by range. The closest aircraft appear first. The table uses the full terminal width and redraws every second. Resize the terminal to update the layout.

The table shows callsign, ICAO address, altitude, speed, heading, vertical rate, squawk, position, range, bearing, and age. It uses shorter headers and extra value rows when the terminal gets narrow.

The CLI keeps the last valid callsign if a later feed record has no callsign or a placeholder. It shows the ICAO address until it receives a valid callsign. It removes aircraft after two minutes without an update.

Range uses nautical miles. Bearing uses degrees clockwise from north. The feed does not provide an aircraft type or route.

## Read JSON updates

Run `radar-adsb --debug` to print one JSON object for each aircraft update. This mode does not draw the table.

## Options and errors

Run `radar-adsb --help` to show command help. Run `radar-adsb --version` to show the package version.

The command writes feed errors to standard error. It retries after two seconds. It exits with code 0 after help, version, or signal shutdown. It exits with code 1 after a fatal error. It exits with code 2 after invalid options.

## Receiver requirements

Enable SBS/BaseStation TCP output in RTL1090. Use port `30003` unless you set another port. Select RTL1090's Table tab and close it normally if the feed sends no aircraft. Read the [RTL1090 task guide](rtl1090-background.md) for setup steps.
