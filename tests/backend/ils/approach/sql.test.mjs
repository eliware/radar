import { expect, test } from "@jest/globals";
import { ILS_APPROACH_QUERY, ILS_MARKER_QUERY } from "../../../../src/backend/ils/approach/sql.mjs";

test("selects operational ILS courses and optional glide-slope data", () => {
  expect(ILS_APPROACH_QUERY).toContain("FROM ILS_BASE I LEFT JOIN ILS_GS G");
  expect(ILS_APPROACH_QUERY).toContain("I.COMPONENT_STATUS LIKE 'OPERATIONAL%'");
  expect(ILS_APPROACH_QUERY).toContain("CAST(G.G_S_ANGLE AS REAL) AS glideSlopeDegrees");
});

test("selects operational marker beacon records", () => {
  expect(ILS_MARKER_QUERY).toContain("FROM ILS_MKR WHERE COMPONENT_STATUS LIKE 'OPERATIONAL%'");
  expect(ILS_MARKER_QUERY).toContain("ILS_COMP_TYPE_CODE AS componentType");
});
