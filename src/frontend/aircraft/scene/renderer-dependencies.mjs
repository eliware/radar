import * as THREE from "three";

export function getAircraftSceneRendererDependencies(windowRef = globalThis.window) {
  return { THREE, windowRef };
}
