import { expect, test } from "@jest/globals";
import { buildFrontend } from "../../src/frontend/build.mjs";

test("builds the browser bundle and async chunks under dist", () => {
  expect(buildFrontend()).toEqual({
    bundleExists: true,
    chunksExist: true,
    asyncChunkExists: true,
  });
}, 30000);
