import { clipPolylineToViewport } from "./clip-polyline.mjs";
import { intersectsViewport } from "./viewport.mjs";

const LAYERS = [
  ["airports", "updateAirports", 35, (item) => item.faaId],
  ["navaids", "updateNavaids", 1, (item) => `${item.state}:${item.identifier}`],
  ["boundaries", "updateBoundaries", 0, (item) => item.id],
  ["ils", "updateIls", 35, (item) => `${item.faaId}:${item.runwayEnd}`],
  ["procedures", "updateProcedures", 35, (item) => item.id],
  ["airways", "updateAirways", 0, (item) => item.id],
];

export function createRadarReferenceCache() {
  const cache = LAYERS.map(() => new Map());
  return {
    add(collections) {
      collections.forEach((items, index) => {
        const identity = LAYERS[index][3];
        for (const item of items) cache[index].set(identity(item), item);
      });
    },
    apply(scene, bounds, location) {
      const collections = LAYERS.map(([, , padding], index) => {
        const items = [...cache[index].values()];
        return bounds ? visibleItems(items, bounds, location, padding) : items;
      });
      applyCollections(scene, collections);
    },
    clear(scene) {
      applyCollections(
        scene,
        LAYERS.map(() => []),
      );
    },
  };
}

function applyCollections(scene, collections) {
  if (scene.updateAll) scene.updateAll(collections);
  else LAYERS.forEach(([, update], index) => scene[update](collections[index]));
}

function visibleItems(items, bounds, location, padding) {
  return items.flatMap((item) => {
    if (item.points?.length > 1) return clipPolylineToViewport(item, bounds, location);
    return intersectsViewport(item, bounds, location, padding) ? [item] : [];
  });
}
