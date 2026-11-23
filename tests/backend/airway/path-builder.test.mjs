import { expect, test } from "@jest/globals";
import { default as buildAirways } from "../../../src/backend/airway/path-builder.mjs";

const row = (fix, longitude, nextFix = "", sequence = 1) => ({
  name: "Q12",
  location: "C",
  regulatory: "Y",
  sequence,
  fix,
  nextFix,
  latitude: 0,
  longitude,
});

test("groups connected fixes and assigns path identifiers", () => {
  const paths = buildAirways([row("WEST", -0.5, "EAST", 10), row("EAST", 0.5, "", 20)], {
    latitude: 0,
    longitude: 0,
  });
  expect(paths).toHaveLength(1);
  expect(paths[0]).toMatchObject({ id: "Q12:C:Y:0", name: "Q12", type: "Q" });
  expect(paths[0].points.map(({ fix }) => fix)).toEqual(["WEST", "EAST"]);
  expect(paths[0].points[0].x).toBeCloseTo(-30);
});

test("splits discontinuous fixes and ignores coordinates that cannot be projected", () => {
  const paths = buildAirways(
    [
      row("A", 0.1, "B", 10),
      row("BAD", Number.NaN, "", 20),
      row("C", 0.2, "", 30),
      row("D", 0.3, "", 40),
    ],
    { latitude: 0, longitude: 0 },
  );
  expect(paths.map(({ points }) => points.map(({ fix }) => fix))).toEqual([["A"], ["C"], ["D"]]);
});

test("splits airway branches that reconnect at a fix across a sequence gap", () => {
  const paths = buildAirways(
    [
      row("JOIN", 0.1, "WEST", 10),
      row("WEST", 0.2, "JOIN", 20),
      row("JOIN", 0.3, "EAST", 100),
      row("EAST", 0.4, "", 110),
    ],
    { latitude: 0, longitude: 0 },
  );
  expect(paths.map(({ points }) => points.map(({ fix }) => fix))).toEqual([
    ["JOIN", "WEST"],
    ["JOIN", "EAST"],
  ]);
});
