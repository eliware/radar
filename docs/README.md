# Radar user guides

Radar is a browser-based aircraft tracking app and a terminal client for an existing ADS-B receiver. It reads decoded aircraft data from an SBS/BaseStation TCP stream. It does not decode radio signals. Run the app on the receiver computer or a second computer on its network.

## Set up Radar

- Linux users can follow the Compose deployment guide to run the browser app with an RTL-SDR. Compose starts three feeder containers by default. Flightradar24 is an optional profile.
- Windows users can configure RTL1090 with the receiver guide. The web task guide explains how to run Radar in the background.
- The terminal aircraft table works with any SBS/BaseStation TCP source. See the CLI guide for setup steps.
- To add the website to a phone Home Screen, follow the Home Screen guide.

For a source checkout, install Git LFS before cloning so the FAA database is available. Install Node.js 26 or later and run `npm ci`. Build browser assets with `npm run build` before starting the web app with `node bin/radar.mjs`. The CLI can run directly from the checkout with `node bin/adsb.mjs`.

Runtime variables and accepted values are listed in the configuration guide. The browser server listens on TCP port 3000 by default. Its API has no authentication, so limit it to a trusted network. Stop a foreground process with `Ctrl+C`. Follow the deployment guides to manage background processes.

## Guides

- [ADS-B command-line tool](adsb-cli.md) explains commands, data connection settings, table fields, and errors.
- [Configuration](configuration.md) lists web and CLI environment variables, defaults, and validation rules.
- [FAA NASR data](nasr-data.md) explains airport, runway, navigation equipment, and procedure data.
- [Linux Compose deployment](linux-compose.md) explains Docker setup, receiver access, app health, and operations.
- [RTL1090 background task](rtl1090-background.md) explains receiver setup and Windows task control.
- [Web API and radar view](web-api.md) explains radar controls, layers, data sources, routes, and network use.
- [Home Screen app](pwa.md) explains adding Radar to a phone and its online-only behavior.
- [Web background task](web-service-background.md) explains Windows startup tasks and health checks.
