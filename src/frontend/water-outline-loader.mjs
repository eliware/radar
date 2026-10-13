import { decodeWaterTile } from "./decode-water-tile.mjs";
import { selectWaterTiles, selectWaterZoom } from "./water-tile-coordinates.mjs";

const TILE_JSON_URL = "https://tiles.openfreemap.org/planet";

export function createWaterOutlineLoader(fetchRef = fetch) {
  let tileJsonPromise;
  let generation = 0;
  const cache = new Map();
  const pending = new Map();
  return {
    async load(center, rangeNm, onChange) {
      const current = ++generation;
      try {
        tileJsonPromise ??= getTileJson(fetchRef).catch((error) => {
          tileJsonPromise = null;
          throw error;
        });
        const tileJson = await tileJsonPromise;
        const zoom = selectWaterZoom(center.latitude, rangeNm);
        const tiles = selectWaterTiles(center, rangeNm, zoom);
        await Promise.all(
          tiles.map((tile) => loadTile(fetchRef, tileJson, tile, cache, pending).catch(() => {})),
        );
        if (current === generation) onChange(pathsFor(tiles, cache));
      } catch {
        if (current === generation) onChange([]);
      }
    },
    cancel() {
      generation += 1;
    },
  };
}

async function getTileJson(fetchRef) {
  const response = await fetchRef(TILE_JSON_URL);
  if (!response.ok) throw new Error("Water tile metadata request failed.");
  return response.json();
}

async function loadTile(fetchRef, tileJson, tile, cache, pending) {
  if (cache.has(tile.key)) return;
  if (pending.has(tile.key)) return pending.get(tile.key);
  const request = fetchTile(fetchRef, tileJson, tile, cache).finally(() =>
    pending.delete(tile.key),
  );
  pending.set(tile.key, request);
  return request;
}

async function fetchTile(fetchRef, tileJson, tile, cache) {
  const template = tileJson.tiles?.[0];
  if (!template) return;
  const response = await fetchRef(
    template.replace("{z}", tile.z).replace("{x}", tile.x).replace("{y}", tile.y),
  );
  if (!response.ok) return;
  cache.set(tile.key, decodeWaterTile(await response.arrayBuffer(), tile));
  if (cache.size > 96) cache.delete(cache.keys().next().value);
}

function pathsFor(tiles, cache) {
  return tiles.flatMap((tile) => cache.get(tile.key) ?? []);
}
