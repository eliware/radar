import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { getAircraftSceneRendererDependencies } from "../../../../src/frontend/aircraft/scene/renderer-dependencies.mjs";

test("selects Three.js and the supplied browser window dependency", () => {
  const windowRef = { document: {} };
  expect(getAircraftSceneRendererDependencies(windowRef)).toEqual({ THREE, windowRef });
});
