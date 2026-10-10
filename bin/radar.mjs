#!/usr/bin/env node
import { startWebApplication } from "../src/backend/main.mjs";
import { runtimeDependencies } from "../src/backend/runtime-dependencies.mjs";

startWebApplication(runtimeDependencies).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
