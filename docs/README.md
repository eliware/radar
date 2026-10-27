# Radar user guides

Radar is a browser-based aircraft tracking app and a terminal client for an existing ADS-B receiver. It reads decoded aircraft data from an SBS/BaseStation TCP stream; it does not decode radio signals. For installation, startup, network access, and shutdown instructions, see [Web API and radar view](web-api.md).

## Guides

- [ADS-B command-line tool](adsb-cli.md) explains commands, data connection settings, table fields, and errors.
- [Configuration](configuration.md) lists web and CLI environment variables, defaults, and validation rules.
- [FAA NASR data](nasr-data.md) explains airport, runway, navigation equipment, and procedure data.
- [Linux Compose deployment](linux-compose.md) explains Docker setup, receiver access, app health, and operations.
- [RTL1090 background task](rtl1090-background.md) explains receiver setup and Windows task control.
- [Web API and radar view](web-api.md) explains radar controls, layers, data sources, routes, and network use.
- [Home Screen app](pwa.md) explains adding Radar to a phone and its online-only behavior.
- [Web background task](web-service-background.md) explains Windows startup tasks and health checks.
