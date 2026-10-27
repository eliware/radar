import * as radarRange from "./range.mjs";
import { createRadarLabel } from "./label.mjs";
import { getRadarRingColor } from "./palette.mjs";

export function createRadarSceneOverlays(THREE, scene, documentRef) {
  const rings = new Map();
  const labels = new Map();
  const axes = [];
  const paletteObjects = [];
  let connected = false;
  for (let range = 1; range <= 10; range += 1) addRing(range);
  for (let range = 15; range <= 300; range += 5) addRing(range);
  axes.push(addAxis("x"), addAxis("z"));
  function updateRange(range) {
    const visible = new Set(radarRange.getRadarRingRanges(range));
    const majorStep = radarRange.getRadarRingSpacing(range);
    for (const [distance, ring] of rings) {
      ring.visible = visible.has(distance);
      const major = distance % majorStep === 0;
      ring.userData.major = major;
      ring.userData.baseTube = major ? 0.055 : 0.025;
      ring.material.color.setHex(getRadarRingColor(connected, major));
      const tube = ring.userData.baseTube * (range / 20);
      const labelVisible = major || (range < 10 && distance === Math.floor(range));
      const labelWidth = 6.4 * (range / 20) * (labels.get(distance)?.userData.textWidthRatio ?? 0);
      const gap = labelVisible
        ? radarRange.getRadarLabelGapAngle(distance, labelWidth, 0.12 * (range / 20))
        : 0;
      const arc = 2 * Math.PI - gap;
      ring.rotation.x = 0;
      if (ring.userData.tube !== tube || ring.userData.arc !== arc) {
        ring.geometry.dispose?.();
        ring.geometry = new THREE.TorusGeometry(distance, tube, 6, 192, arc);
        if (labelVisible) ring.geometry.rotateZ(radarRange.RADAR_RING_LABEL_ANGLE + gap / 2);
        ring.geometry.rotateX(Math.PI / 2);
        ring.userData.tube = tube;
        ring.userData.arc = arc;
      }
    }
    for (const [distance, label] of labels) {
      const labeled = distance % majorStep === 0 || (range < 10 && distance === Math.floor(range));
      label.visible = visible.has(distance) && labeled;
      const labelWidth = 6.4 * (range / 20);
      label.position.set(-distance / Math.sqrt(2), 0.08, -distance / Math.sqrt(2));
      label.scale.set(labelWidth, range / 20, 1);
    }
    for (const axis of axes) axis.scale.set(1, range / 300, 1);
  }
  updateRange.setConnected = updateRangeConnected;

  function updateRangeConnected(nextConnected) {
    connected = nextConnected;
    const colors = connected
      ? { bright: 0x00ff41, label: "#00ff41" }
      : { bright: 0x555555, label: "#555555" };
    for (const entry of paletteObjects) {
      if (entry.material) {
        entry.material.color.setHex(
          entry.axis ? colors.bright : getRadarRingColor(connected, entry.ring.userData.major),
        );
      }
      entry.label?.userData.setColor(colors.label);
    }
  }
  updateRangeConnected(false);
  return updateRange;

  function addRing(range) {
    const major = range % radarRange.getRadarRingSpacing(20) === 0;
    const baseTube = major ? 0.055 : 0.025;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(range, baseTube, 6, 192),
      new THREE.MeshBasicMaterial({ color: getRadarRingColor(connected, major) }),
    );
    ring.geometry.rotateX(Math.PI / 2);
    ring.rotation.x = 0;
    ring.userData = { baseTube, tube: baseTube, major };
    scene.add(ring);
    paletteObjects.push({ material: ring.material, ring });
    rings.set(range, ring);
    const label = createRadarLabel(THREE, `${range}`, documentRef, "center");
    if (label) {
      scene.add(label);
      labels.set(range, label);
      paletteObjects.push({ label });
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
    paletteObjects.push({ material: line.material, axis: true });
    return line;
  }
}
