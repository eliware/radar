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
  context.font = '48px Consolas, "Courier New", monospace';
  const textWidthRatio = Math.min(
    1,
    (context.measureText?.(text).width ?? text.length * 28) / canvas.width,
  );
  context.shadowColor = "#000";
  context.shadowBlur = 4;
  const draw = (color) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.textAlign = alignment;
    const x = alignment === "right" ? 508 : alignment === "center" ? 256 : 4;
    context.textBaseline = "middle";
    context.fillText(text, x, 40);
  };
  draw("#00ff41");
  const texture = new THREE.CanvasTexture(canvas);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  label.scale.set(6.4, 1, 1);
  label.userData.texture = texture;
  label.userData.textWidthRatio = textWidthRatio;
  label.userData.setColor = (color) => {
    draw(color);
    texture.needsUpdate = true;
  };
  return label;
}

export function removeRadarLabel(scene, label) {
  if (!label) return;
  scene.remove(label);
  label.material.map?.dispose();
  label.material.dispose();
}
