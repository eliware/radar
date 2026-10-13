import { projectMapCoordinate } from "./project-map-coordinate.mjs";
import { clipMapSegment } from "./clip-map-segment.mjs";

export function createMapOutlineLayer(THREE, scene, outlines, location, elevationFeet) {
  if (!outlines || !location) {
    const dispose = () => {};
    dispose.setRange = () => {};
    return dispose;
  }
  let range = 300;
  const positions = [];
  const geometry = new THREE.BufferGeometry();
  for (const layer of [outlines?.coastline, outlines?.lakes]) {
    for (const path of layer ?? []) addPath(path);
  }
  const material = new THREE.LineBasicMaterial({ color: 0x383838, depthTest: true });
  const lines = new THREE.LineSegments(geometry, material);
  scene.add(lines);
  const dispose = () => {
    scene.remove(lines);
    geometry.dispose();
    material.dispose();
  };
  dispose.setRange = (value) => {
    range = value;
    positions.length = 0;
    for (const layer of [outlines?.coastline, outlines?.lakes]) {
      for (const path of layer ?? []) addPath(path);
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  };
  dispose.setRange(range);
  return dispose;

  function addPath(path) {
    for (let index = 1; index < path.length; index += 1) {
      const start = projectMapCoordinate(path[index - 1], location, elevationFeet);
      const end = projectMapCoordinate(path[index], location, elevationFeet);
      if (!start || !end || Math.abs(start.x - end.x) > 10000) continue;
      const clipped = clipMapSegment(start, end, range);
      if (clipped) for (const point of clipped) positions.push(point.x, point.y, point.z);
    }
  }
}
