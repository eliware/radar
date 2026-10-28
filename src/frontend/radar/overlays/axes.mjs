export function createRadarAxes(THREE, scene) {
  const axes = [createAxis("x"), createAxis("z")];
  function updateRange(range) {
    for (const axis of axes) axis.scale.set(1, range / 300, 1);
  }
  function setConnected(connected) {
    const color = connected ? 0x00ff41 : 0x555555;
    for (const axis of axes) axis.material.color.setHex(color);
  }
  return { updateRange, setConnected };

  function createAxis(axis) {
    const line = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 600, 6),
      new THREE.MeshBasicMaterial({ color: 0x00ff41 }),
    );
    line.position.set(0, 0, 0);
    line.rotation[axis === "x" ? "z" : "x"] = Math.PI / 2;
    scene.add(line);
    return line;
  }
}
