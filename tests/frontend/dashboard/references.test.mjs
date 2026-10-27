import { expect, jest, test } from "@jest/globals";
import { loadDashboardReferences } from "../../../src/frontend/dashboard/references.mjs";

test("loads viewport references and subscribes to view changes", async () => {
  const bounds = { minX: -5, maxX: 5, minZ: -5, maxZ: 5, minRangeNm: 0, maxRangeNm: 20 };
  let onViewChange;
  const detachReference = jest.fn();
  const scene = Object.fromEntries(
    [
      "updateAirports",
      "updateNavaids",
      "updateBoundaries",
      "updateIls",
      "updateProcedures",
      "updateAirways",
    ].map((method) => [method, jest.fn()]),
  );
  Object.assign(scene, {
    getViewportBounds: jest.fn(() => bounds),
    onViewChange: jest.fn((callback) => ((onViewChange = callback), detachReference)),
  });
  const fetchData = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
  const detach = loadDashboardReferences(fetchData, scene, {});
  expect(detach).toBe(detachReference);
  expect(fetchData).toHaveBeenCalledTimes(6);
  onViewChange();
  expect(scene.getViewportBounds).toHaveBeenCalledTimes(2);
});

test("skips references when the scene lacks reference methods", () => {
  expect(loadDashboardReferences(jest.fn(), {}, {})).toEqual(expect.any(Function));
});
