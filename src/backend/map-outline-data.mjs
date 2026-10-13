import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const dataFile = new URL("./data/map-outlines.json.gz", import.meta.url);

export function loadMapOutlines(read = readFileSync, decompress = gunzipSync) {
  return JSON.parse(decompress(read(dataFile)));
}
