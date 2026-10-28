import { RADAR_RING_LABEL_ANGLE } from "../range.mjs";
import { getRadarLabelGapAngle } from "../label-gap-angle.mjs";
import { getRadarRingRanges } from "../ring/ranges.mjs";
import { getRadarRingSpacing } from "../ring/spacing.mjs";
import { createRadarLabel } from "../label.mjs";
import { getRadarRingColor } from "../ring/color.mjs";

export function createRadarRings(THREE, scene, documentRef) {
  const rings = new Map();
  const labels = new Map();
  const paletteObjects = [];
  let connected = false;
  for (let range = 1; range <= 10; range += 1) addRing(range);
  for (let range = 15; range <= 300; range += 5) addRing(range);

  function updateRange(range) {
    const visible = new Set(getRadarRingRanges(range));
    const majorStep = getRadarRingSpacing(range);
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
        ? getRadarLabelGapAngle(distance, labelWidth, 0.12 * (range / 20))
        : 0;
      const arc = 2 * Math.PI - gap;
      ring.rotation.x = 0;
      if (ring.userData.tube !== tube || ring.userData.arc !== arc) {
        ring.geometry.dispose?.();
        ring.geometry = new THREE.TorusGeometry(distance, tube, 6, 192, arc);
        if (labelVisible) ring.geometry.rotateZ(RADAR_RING_LABEL_ANGLE + gap / 2);
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
  }

  function setConnected(nextConnected) {
    connected = nextConnected;
    const labelColor = connected ? "#00ff41" : "#555555";
    for (const entry of paletteObjects) {
      if (entry.material)
        entry.material.color.setHex(getRadarRingColor(connected, entry.ring.userData.major));
      entry.label?.userData.setColor(labelColor);
    }
  }

  setConnected(false);
  return { updateRange, setConnected };

  function addRing(range) {
    const major = range % getRadarRingSpacing(20) === 0;
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
}
