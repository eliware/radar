const TILE_JSON_URL = "https://tiles.openfreemap.org/planet";

export function createWaterTileMetadataLoader(fetchRef) {
  let metadataPromise;
  return {
    load() {
      metadataPromise ??= fetchRef(TILE_JSON_URL)
        .then((response) => {
          if (!response.ok) throw new Error("Water tile metadata request failed.");
          return response.json();
        })
        .catch((error) => {
          metadataPromise = null;
          throw error;
        });
      return metadataPromise;
    },
  };
}
