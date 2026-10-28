export function removeRadarLabel(scene, label) {
  if (!label) return;
  scene.remove(label);
  label.material.map?.dispose();
  label.material.dispose();
}
