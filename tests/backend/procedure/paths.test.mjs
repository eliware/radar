import { expect, test } from "@jest/globals";
import { createProcedurePaths } from "../../../src/backend/procedure/paths.mjs";

function row(type, routeName, sequence, fix, options = {}) {
  return {
    type,
    name: type === "SID" ? "LBSTA" : "OOSHN",
    code: "PROC5",
    airportId: "BOS",
    portionType: options.portion ?? "BODY",
    routeName,
    bodySequence: "1",
    transitionCode: options.transition ?? "",
    runwayAssociation: options.runway ?? "",
    sequence,
    fix,
    fixType: "WP",
    latitude: 43 + sequence / 1000,
    longitude: -70,
    ...options,
  };
}

test("groups SID routes and labels only each last fix", () => {
  const paths = createProcedurePaths([
    row("SID", "A-LBSTA", 10, "A"),
    row("SID", "A-LBSTA", 20, "LBSTA"),
    row("SID", "B-LBSTA", 10, "B"),
    row("SID", "B-LBSTA", 20, "LBSTA"),
  ]);
  expect(paths).toHaveLength(2);
  expect(
    paths.map((path) => path.points.filter((point) => point.label).map((point) => point.fix)),
  ).toEqual([["LBSTA"], ["LBSTA"]]);
});

test("labels STAR transition entries, common main fixes, and route endpoints", () => {
  const rows = [
    row("STAR", "BODY-A", 10, "EURRO"),
    row("STAR", "BODY-A", 20, "OOSHN"),
    row("STAR", "BODY-A", 30, "AYBEE"),
    row("STAR", "BODY-B", 10, "EURRO"),
    row("STAR", "BODY-B", 20, "OOSHN"),
    row("STAR", "BODY-B", 30, "JOBEE"),
    row("STAR", "AJJAY TRANSITION", 10, "AJJAY", {
      portion: "TRANSITION",
      transition: "AJJAY.PROC5",
    }),
    row("STAR", "AJJAY TRANSITION", 20, "EURRO", {
      portion: "TRANSITION",
      transition: "AJJAY.PROC5",
    }),
  ];
  const paths = createProcedurePaths(rows);
  expect(
    paths.map((path) => path.points.filter((point) => point.label).map((point) => point.fix)),
  ).toEqual([["OOSHN", "AYBEE"], ["OOSHN", "JOBEE"], ["AJJAY"]]);
});

test("drops routes that contain fewer than two fixes", () => {
  expect(createProcedurePaths([row("SID", "ONE", 10, "ONLY")])).toEqual([]);
});

test("keeps a STAR body without a common main fix unlabeled", () => {
  expect(createProcedurePaths([row("STAR", "BODY", 10, "EURRO")])).toEqual([]);
});
