import { expect, test } from "@jest/globals";
import packageJson from "../../package.json" with { type: "json" };
import { createRadarUserAgent } from "../../src/backend/user-agent.mjs";

test("includes the package version in the Radar user agent", () => {
  expect(createRadarUserAgent()).toBe(
    `EliwareRadar/${packageJson.version} (+https://radar.purinton.us; contact: radar@eliware.org)`,
  );
});
