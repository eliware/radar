import { getRadarRingRanges } from "./radar-range.mjs";
import { createRadarLabel } from "./radar-label.mjs";

export function createRadarSceneOverlays(THREE, scene, documentRef) {
  const rings = new Map();
  const labels = new Map();
  const axes = [];
  for (let range = 1; range <= 10; range += 1) addRing(range);
  for (let range = 15; range <= 300; range += 5) addRing(range);
  axes.push(addAxis("x"), addAxis("z"));
  return (range) => {
    const visible = new Set(getRadarRingRanges(range));
    for (const [distance, ring] of rings) {
      ring.visible = visible.has(distance);
      const tube = ring.userData.baseTube * (range / 20);
      if (ring.userData.tube !== tube) {
        ring.geometry.dispose?.();
        ring.geometry = new THREE.TorusGeometry(distance, tube, 6, 192);
        ring.userData.tube = tube;
      }
    }
    for (const [distance, label] of labels) {
      label.visible =
        visible.has(distance) &&
        (distance % 10 === 0 || (range < 10 && distance === Math.floor(range)));
      const offset = (distance / range) * range * Math.SQRT1_2;
      label.position.set(-offset, 0.08, -offset);
      label.scale.set(6.4 * (range / 20), range / 20, 1);
    }
    for (const axis of axes) axis.scale.set(1, range / 300, 1);
  };

  function addRing(range) {
    const major = range % 10 === 0;
    const baseTube = major ? 0.055 : 0.025;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(range, baseTube, 6, 192),
      new THREE.MeshBasicMaterial({ color: major ? 0x006b26 : 0x003814 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.userData = { baseTube, tube: baseTube };
    scene.add(ring);
    rings.set(range, ring);
    const label = createRadarLabel(THREE, `${range}`, documentRef);
    if (label) {
      scene.add(label);
      labels.set(range, label);
    }
  }

  function addAxis(axis) {
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
