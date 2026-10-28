const FEET_PER_NM = 6076.12;

export function createAirspaceVertices(edges, center, homeElevationFeet) {
  const vertices = [];
  for (const ring of edges.rings)
    addCircle(vertices, center, ring.radius, ring.altitude, homeElevationFeet);
  for (const wall of edges.walls)
    addVertical(vertices, center, wall.radius, wall.floor, wall.ceiling, homeElevationFeet);
  return vertices;
}

function addCircle(vertices, center, radius, altitude, homeElevationFeet) {
  const height = (altitude - homeElevationFeet) / FEET_PER_NM;
  for (let step = 0; step < 64; step++) {
    const first = (step * Math.PI * 2) / 64;
    const second = ((step + 1) * Math.PI * 2) / 64;
    vertices.push(
      ...point(center, radius, first, height),
      ...point(center, radius, second, height),
    );
  }
}

function addVertical(vertices, center, radius, floor, ceiling, homeElevationFeet) {
  const bottom = (floor - homeElevationFeet) / FEET_PER_NM;
  const top = (ceiling - homeElevationFeet) / FEET_PER_NM;
  for (let step = 0; step < 8; step++) {
    const angle = (step * Math.PI * 2) / 8;
    vertices.push(...point(center, radius, angle, bottom), ...point(center, radius, angle, top));
  }
}

function point(center, radius, angle, height) {
  return [center.x + Math.cos(angle) * radius, height, center.z + Math.sin(angle) * radius];
}
