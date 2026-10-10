# ADS-B command

The `radar-adsb` command reads decoded SBS/BaseStation records from an RTL1090 TCP feed. It shows live flight strips in the terminal. It keeps recent aircraft fields when later records omit them.

## Start

Run `radar-adsb` after npm installation. From a checkout, run `node bin/adsb.mjs`. The default feed address is `127.0.0.1:30003`.

Run `radar-adsb --host 127.0.0.1 --port 30003` to set the feed address. You can set `ADSB_HOST` and `ADSB_PORT` in an untracked `.env` file.

Set `MY_LOCATION` in `.env` as decimal latitude, then longitude. The CLI uses this point to calculate distance and bearing.

## Output

The table fills the terminal width. It shows callsign, ICAO address, altitude, speed, heading, vertical rate, squawk, position, distance, bearing, and age. The CLI keeps all 22 SBS fields in memory. It sorts aircraft by distance, closest first. Resize the terminal to redraw the table. The table uses short headers, then two or three value rows, as the terminal gets narrow. Aircraft rows show values only.

Distance uses nautical miles. Bearing uses degrees clockwise from north. The feed does not provide aircraft type or destination.

The aircraft list keeps the last non-empty value when a later record has an empty column. It removes aircraft after two minutes without an update.

RTL1090 sends changed aircraft messages in Flight Table mode, at up to one update per aircraft every two seconds. Its manual lists only `RM`, `OK`, and `AD` status records. The receiver can limit which messages it sends.

## Help and errors

Run `radar-adsb --help` for usage. Run `radar-adsb --version` for the package version. The command retries TCP feed errors after two seconds and writes each error to standard error. It uses exit code 0 after help, version, or signal shutdown; 1 for a fatal runtime error; and 2 for invalid options.

RTL1090 must enable SBS/BaseStation TCP output. The command does not read raw SDR samples or change receiver settings.
