import { default as selectVisibleReferenceItems } from "./select-visible/items.mjs";
import { default as createRadarReferenceViewApplier } from "./view/applier.mjs";
import { default as createRadarReferenceLayers } from "./layers.mjs";

function createRadarReferenceCacheSession(scene, location) {
  const layers = createRadarReferenceLayers();
  const cache = layers.map(() => new Map());
  let latestBounds = null;
  const applier = createRadarReferenceViewApplier(
    {
      apply(_scene, bounds) {
        applyCache(scene, cache, bounds, location, layers);
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
        const identity = layers[index][3];
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
        layers.map(() => []),
        layers,
      );
    },
  };
}

function applyCache(scene, cache, bounds, location, layers) {
  const collections = layers.map(([, , padding], index) => {
    const items = [...cache[index].values()];
    return bounds ? selectVisibleReferenceItems(items, bounds, location, padding) : items;
  });
  applyCollections(scene, collections, layers);
}

function applyCollections(scene, collections, layers) {
  if (scene.updateAll) scene.updateAll(collections);
  else layers.forEach(([, update], index) => scene[update](collections[index]));
}
export default createRadarReferenceCacheSession;
