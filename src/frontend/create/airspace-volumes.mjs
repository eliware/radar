import { projectAircraftPosition } from "../aircraft/space-position.mjs";
import { airportAirspaceBands } from "../airport-airspace/bands.mjs";
import { airportAirspaceEdges } from "../airport-airspace/edges.mjs";

const AIRSPACE_COLOR = 0x777777;
const FEET_PER_NM = 6076.12;

export function createAirspaceVolumes(THREE, scene, location, homeElevationFeet) {
  const shapes = new Map();
  let material;
  let visible = true;
  let visibleIds = new Set();
  function update(airports) {
    visibleIds = new Set();
    for (const airport of airports) {
      const id = airport.faaId;
      visibleIds.add(id);
      const bands = airportAirspaceBands(airport);
      const position = projectAircraftPosition(airport, location, 0);
      const airportElevationFeet = Number.isFinite(airport.elevationFeet)
        ? airport.elevationFeet
        : 0;
      const signature = JSON.stringify([
        airport.latitude,
        airport.longitude,
        airportElevationFeet,
        bands,
      ]);
      const existing = shapes.get(id);
      if (existing?.signature === signature) continue;
      if (existing) removeShape(id, existing);
      if (!bands.length || !position) continue;
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
      shapes.set(id, { lines, signature });
    }
    for (const [id, shape] of shapes) shape.lines.visible = visible && visibleIds.has(id);
  }
  function setVisible(value) {
    visible = Boolean(typeof value === "object" ? value.airportsVisible : value);
    for (const [id, shape] of shapes) shape.lines.visible = visible && visibleIds.has(id);
  }
  function removeShape(id, shape) {
    scene.remove(shape.lines);
    shape.lines.geometry.dispose();
    shapes.delete(id);
  }
  function dispose() {
    for (const [id, shape] of shapes) removeShape(id, shape);
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
