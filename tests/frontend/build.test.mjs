import { expect, test } from "@jest/globals";
import { buildFrontend } from "../../src/frontend/build.mjs";

test("builds the browser bundle and async chunks under dist", () => {
  const expected = {
    bundleExists: true,
    chunksExist: true,
    asyncChunkExists: true,
  };
  expect(buildFrontend(undefined, "development")).toEqual(expected);

  const productionCommand = [];
  expect(buildFrontend((...args) => productionCommand.push(args))).toEqual(expected);
  expect(productionCommand[0][1]).toContain("production");
}, 30000);
