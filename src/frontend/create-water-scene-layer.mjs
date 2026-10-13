import { projectAircraftPosition } from "./aircraft-space-position.mjs";

export function createWaterSceneLayer(THREE, scene, location, elevationFeet) {
  const material = new THREE.LineBasicMaterial({
    color: 0x777777,
    transparent: true,
    opacity: 0.5,
  });
  let line = null;
  let visible = true;
  return {
    setPaths(paths) {
      if (line) {
        scene.remove(line);
        line.geometry.dispose();
      }
      const points = [];
      for (const path of paths) {
        const projected = path
          .map((point) =>
            projectAircraftPosition({ ...point, altitudeFeet: 0 }, location, elevationFeet),
          )
          .filter(Boolean);
        for (let index = 1; index < projected.length; index += 1) {
          points.push(
            projected[index - 1].x,
            projected[index - 1].y,
            projected[index - 1].z,
            projected[index].x,
            projected[index].y,
            projected[index].z,
          );
        }
      }
      if (!points.length) {
        line = null;
        return;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      line = new THREE.LineSegments(geometry, material);
      line.visible = visible;
      scene.add(line);
    },
    setVisible(value) {
      visible = Boolean(value);
      if (line) line.visible = visible;
    },
    dispose() {
      if (line) {
        scene.remove(line);
        line.geometry.dispose();
      }
      material.dispose();
    },
  };
}
