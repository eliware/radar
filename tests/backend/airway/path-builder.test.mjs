import { expect, test } from "@jest/globals";
import { buildAirways } from "../../../src/backend/airway/path-builder.mjs";

const row = (fix, longitude, nextFix = "") => ({
  name: "Q12",
  location: "C",
  regulatory: "Y",
  fix,
  nextFix,
  latitude: 0,
  longitude,
});

test("groups connected fixes and assigns path identifiers", () => {
  const paths = buildAirways([row("WEST", -0.5, "EAST"), row("EAST", 0.5)], {
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
    [row("A", 0.1, "B"), row("BAD", Number.NaN), row("C", 0.2), row("D", 0.3)],
    { latitude: 0, longitude: 0 },
  );
  expect(paths.map(({ points }) => points.map(({ fix }) => fix))).toEqual([["A"], ["C"], ["D"]]);
});
