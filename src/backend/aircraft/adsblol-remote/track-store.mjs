import { default as createTrackStore } from "./track/store.mjs";

function createAdsbLolTrackStore(options) {
  return createTrackStore(options);
}
export default createAdsbLolTrackStore;
