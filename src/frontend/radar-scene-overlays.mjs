import { getRadarRingRanges } from "./radar-range.mjs";

export function createRadarSceneOverlays(THREE, scene) {
  const rings = new Map();
  const axes = [];
  for (let range = 1; range <= 10; range += 1) addRing(range);
  for (let range = 15; range <= 300; range += 5) addRing(range);
  axes.push(addAxis("x"), addAxis("z"));
  return (range) => {
    const visible = new Set(getRadarRingRanges(range));
    for (const [distance, ring] of rings) ring.visible = visible.has(distance);
    for (const axis of axes) axis.scale.set(1, range / 300, 1);
  };

  function addRing(range) {
    const major = range % 10 === 0;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(range, major ? 0.055 : 0.025, 6, 192),
      new THREE.MeshBasicMaterial({ color: major ? 0x18516b : 0x103548 }),
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    rings.set(range, ring);
  }

  function addAxis(axis) {
    const line = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 600, 6),
      new THREE.MeshBasicMaterial({ color: 0x176b9e }),
    );
    line.position.set(0, 0, 0);
    line.rotation[axis === "x" ? "z" : "x"] = Math.PI / 2;
    scene.add(line);
    return line;
  }
}
