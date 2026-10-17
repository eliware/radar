import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { airportAirspaceEdges, airportAirspaceBands } from "./airport-airspace-bands.mjs";

const AIRSPACE_COLOR = 0x777777;
const FEET_PER_NM = 6076.12;

export function createAirspaceVolumes(THREE, scene, location, homeElevationFeet) {
  const shapes = new Map();
  let material;
  let visible = true;
  function update(airports) {
    for (const airport of airports) {
      const id = airport.faaId;
      if (shapes.has(id)) continue;
      const bands = airportAirspaceBands(airport);
      if (!bands.length) continue;
      const position = projectAircraftPosition(airport, location, 0);
      if (!position) continue;
      const airportElevationFeet = Number.isFinite(airport.elevationFeet)
        ? airport.elevationFeet
        : 0;
      material ??= new THREE.LineBasicMaterial({
        color: AIRSPACE_COLOR,
        transparent: true,
        opacity: 0.5,
      });
      const edges = airportAirspaceEdges(bands, airportElevationFeet);
      const vertices = [];
      for (const ring of edges.rings)
        addCircle(vertices, position, ring.radius, ring.altitude, homeElevationFeet);
      for (const wall of edges.walls)
        addVertical(vertices, position, wall.radius, wall.floor, wall.ceiling, homeElevationFeet);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      const lines = new THREE.LineSegments(geometry, material);
      lines.visible = visible;
      scene.add(lines);
      shapes.set(id, lines);
    }
  }
  function setVisible(value) {
    visible = Boolean(typeof value === "object" ? value.airportsVisible : value);
    for (const shape of shapes.values()) shape.visible = visible;
  }
  function dispose() {
    for (const shape of shapes.values()) {
      scene.remove(shape);
      shape.geometry.dispose();
    }
    shapes.clear();
    material?.dispose();
  }
  return { update, setVisible, dispose };
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
