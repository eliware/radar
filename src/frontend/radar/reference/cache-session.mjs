import { selectVisibleReferenceItems } from "./select-visible-items.mjs";
import { createRadarReferenceViewApplier } from "./view/applier.mjs";

const LAYERS = [
  ["airports", "updateAirports", 35, (item) => item.faaId],
  ["navaids", "updateNavaids", 1, (item) => `${item.state}:${item.identifier}`],
  ["boundaries", "updateBoundaries", 0, (item) => item.id],
  ["ils", "updateIls", 35, (item) => `${item.faaId}:${item.runwayEnd}`],
  ["procedures", "updateProcedures", 35, (item) => item.id],
  ["airways", "updateAirways", 0, (item) => item.id],
];

export function createRadarReferenceCacheSession(scene, location) {
  const cache = LAYERS.map(() => new Map());
  let latestBounds = null;
  const applier = createRadarReferenceViewApplier(
    {
      apply(_scene, bounds) {
        applyCache(scene, cache, bounds, location);
      },
    },
    scene,
    location,
  );

  return {
    setBounds(bounds) {
      latestBounds = bounds;
    },
    add(collections) {
      collections.forEach((items, index) => {
        const identity = LAYERS[index][3];
        for (const item of items) cache[index].set(identity(item), item);
      });
      applier.schedule(latestBounds);
    },
    applyLatest() {
      applier.schedule(latestBounds);
    },
    clear() {
      latestBounds = null;
      applier.cancel();
      applyCollections(
        scene,
        LAYERS.map(() => []),
      );
    },
  };
}

function applyCache(scene, cache, bounds, location) {
  const collections = LAYERS.map(([, , padding], index) => {
    const items = [...cache[index].values()];
    return bounds ? selectVisibleReferenceItems(items, bounds, location, padding) : items;
  });
  applyCollections(scene, collections);
}

function applyCollections(scene, collections) {
  if (scene.updateAll) scene.updateAll(collections);
  else LAYERS.forEach(([, update], index) => scene[update](collections[index]));
}
