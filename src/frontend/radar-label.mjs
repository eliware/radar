export function createRadarLabel(
  THREE,
  text,
  documentRef = globalThis.document,
  alignment = "left",
) {
  if (!documentRef?.createElement || !THREE.CanvasTexture || !THREE.Sprite) return null;
  const canvas = documentRef.createElement("canvas");
  canvas.width = 512;
  canvas.height = 80;
  const context = canvas.getContext("2d");
  context.font = "48px sans-serif";
  context.fillStyle = "#00ff41";
  context.shadowColor = "#000";
  context.shadowBlur = 4;
  context.textAlign = alignment;
  context.fillText(text, alignment === "right" ? 508 : 4, 56);
  const texture = new THREE.CanvasTexture(canvas);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  label.scale.set(6.4, 1, 1);
  label.userData.texture = texture;
  return label;
}

export function removeRadarLabel(scene, label) {
  if (!label) return;
  scene.remove(label);
  label.material.map?.dispose();
  label.material.dispose();
}
