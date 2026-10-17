import { projectWaterPaths } from "../../project/water-paths.mjs";

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
      const points = projectWaterPaths(paths, location, elevationFeet);
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
