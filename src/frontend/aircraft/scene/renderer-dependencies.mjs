import * as THREE from "three";

function getAircraftSceneRendererDependencies(windowRef = globalThis.window) {
  return { THREE, windowRef };
}
export default getAircraftSceneRendererDependencies;
