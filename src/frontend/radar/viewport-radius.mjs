import { MAX_RADAR_RANGE } from "./range.mjs";

export function getRadarViewportRadius(THREE, camera, width, height, groundY = 0) {
  if (!camera || width <= 0 || height <= 0) return 1;
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -groundY);
  const raycaster = new THREE.Raycaster();
  const corner = new THREE.Vector3();
  const radii = [];
  for (const [x, y] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const point = raycaster.ray.intersectPlane(plane, corner);
    if (point) radii.push(Math.hypot(point.x, point.z));
  }
  return Math.min(MAX_RADAR_RANGE, Math.max(1, ...radii));
}

export function createRadarViewportRadius(THREE, camera, container, elevationFeet) {
  return () =>
    getRadarViewportRadius(
      THREE,
      camera,
      container.clientWidth,
      container.clientHeight,
      -elevationFeet / 6076.12,
    );
}
