import { expect, test } from "@jest/globals";
import { parseMetarStations } from "../../../src/backend/metar/stations.mjs";

test("parses unique four-character station codes", () => {
  expect(parseMetarStations(" klew, KPWM,klew, bad, KBXM ")).toEqual(["KLEW", "KPWM", "KBXM"]);
});

test("uses defaults and ignores empty or invalid station codes", () => {
  expect(parseMetarStations()).toEqual(["KLEW", "KPWM", "KBXM"]);
  expect(parseMetarStations("")).toEqual([]);
  expect(parseMetarStations(",abcde, K-, ,")).toEqual([]);
});
