import { createRadarReferenceLoader } from "../radar/reference/loader.mjs";

export function loadDashboardReferences(fetchData, scene, location) {
  const supportsReferences = [
    "updateAirports",
    "updateNavaids",
    "updateBoundaries",
    "updateIls",
    "updateProcedures",
    "updateAirways",
    "getViewportBounds",
  ].every((method) => scene[method]);
  if (!supportsReferences) return () => {};
  const loader = createRadarReferenceLoader(fetchData, scene, location);
  const detach = scene.onViewChange(() => loader.load(scene.getViewportBounds())) ?? (() => {});
  loader.load(scene.getViewportBounds());
  return detach;
}
