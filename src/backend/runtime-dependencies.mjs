import { createLogger, registerHandlers, registerSignals } from "@eliware/common";
import { config } from "dotenv";
import { default as createAircraftFeed } from "./aircraft/feed.mjs";
import { default as createRadarServer } from "./server.mjs";
import { default as createAirportDatabase } from "./airport/database.mjs";
import { default as parseAdsbLocation } from "../shared/adsb-location.mjs";
import { default as createAdsbLolLookup } from "./adsblol-lookup.mjs";
import { default as createAircraftEnrichmentFeed } from "./aircraft/enrichment/feed.mjs";
import { default as createAdsbLolRemoteSource } from "./aircraft/adsblol-remote/source.mjs";
import { default as createMergedAircraftFeed } from "./aircraft/merged/feed.mjs";
import { default as createMetarLookup } from "./metar/lookup.mjs";
import { default as parseMetarStations } from "./metar/stations.mjs";

export const runtimeDependencies = {
  loadEnvironment: config,
  createLogger,
  registerHandlers,
  registerSignals,
  createAircraftFeed,
  createRadarServer,
  createAirportDatabase,
  parseAdsbLocation,
  createAdsbLolLookup,
  createAircraftEnrichmentFeed,
  createAdsbLolRemoteSource,
  createMergedAircraftFeed,
  createMetarLookup,
  parseMetarStations,
};
