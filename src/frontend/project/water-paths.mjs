import { projectAircraftPosition } from "../aircraft/space-position.mjs";

export function projectWaterPaths(paths, location, elevationFeet) {
  const vertices = [];
  for (const path of paths) {
    const points = path
      .map((point) =>
        projectAircraftPosition({ ...point, altitudeFeet: 0 }, location, elevationFeet),
      )
      .filter(Boolean);
    for (let index = 1; index < points.length; index += 1) {
      vertices.push(
        points[index - 1].x,
        points[index - 1].y,
        points[index - 1].z,
        points[index].x,
        points[index].y,
        points[index].z,
      );
    }
  }
  return vertices;
}
