import { createLogger, registerHandlers, registerSignals } from "@eliware/common";
import { config } from "dotenv";
import { createAircraftFeed } from "./aircraft-feed.mjs";
import { createRadarServer } from "./server.mjs";
import { createAirportDatabase } from "./airport-database.mjs";
import { parseAdsbLocation } from "../shared/adsb-location.mjs";
import { createAdsbdbLookup } from "./adsbdb-lookup.mjs";
import { createAircraftEnrichmentFeed } from "./aircraft-enrichment-feed.mjs";
import { createMetarLookup, parseMetarStations } from "./metar-lookup.mjs";

export const runtimeDependencies = {
  loadEnvironment: config,
  createLogger,
  registerHandlers,
  registerSignals,
  createAircraftFeed,
  createRadarServer,
  createAirportDatabase,
  parseAdsbLocation,
  createAdsbdbLookup,
  createAircraftEnrichmentFeed,
  createMetarLookup,
  parseMetarStations,
};
