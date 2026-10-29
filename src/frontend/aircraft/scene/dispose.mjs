export function disposeAircraftSceneResources(resources) {
  resources.workflow.stop();
  resources.layers.destroy();
  resources.water.destroy();
  resources.airspace.dispose();
  resources.overlay.destroy();
  resources.radarCamera.dispose();
  resources.controls.dispose();
  resources.renderer.dispose();
  resources.container.replaceChildren();
}
