import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { airportAirspaceBands } from "./airport-airspace-bands.mjs";

const AIRSPACE_COLOR = 0x777777;
const FEET_PER_NM = 6076.12;

export function createAirspaceVolumes(THREE, scene, location, homeElevationFeet) {
  const shapes = new Map();
  let material;
  function update(airports) {
    for (const airport of airports) {
      const id = airport.faaId;
      if (shapes.has(id)) continue;
      const bands = airportAirspaceBands(airport);
      if (!bands.length) continue;
      const position = projectAircraftPosition(airport, location, 0);
      if (!position) continue;
      material ??= new THREE.LineBasicMaterial({
        color: AIRSPACE_COLOR,
        transparent: true,
        opacity: 0.5,
      });
      const vertices = bands.flatMap((band) => bandVertices(band, position, homeElevationFeet));
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      const lines = new THREE.LineSegments(geometry, material);
      scene.add(lines);
      shapes.set(id, lines);
    }
  }
  function dispose() {
    for (const shape of shapes.values()) {
      scene.remove(shape);
      shape.geometry.dispose();
    }
    shapes.clear();
    material?.dispose();
  }
  return { update, dispose };
}

function bandVertices(band, center, homeElevationFeet) {
  const values = [];
  const bottom = (band.floorFeet - homeElevationFeet) / FEET_PER_NM;
  const top = (band.ceilingFeet - homeElevationFeet) / FEET_PER_NM;
  for (const [radius, height] of [
    [band.outerRadiusNm, bottom],
    [band.outerRadiusNm, top],
  ]) {
    circle(values, center, radius, height);
  }
  if (band.innerRadiusNm > 0) {
    circle(values, center, band.innerRadiusNm, bottom);
    circle(values, center, band.innerRadiusNm, top);
  }
  verticalEdges(values, center, band.outerRadiusNm, bottom, top);
  if (band.innerRadiusNm > 0) verticalEdges(values, center, band.innerRadiusNm, bottom, top);
  return values;
}

function circle(values, center, radius, height) {
  for (let step = 0; step < 64; step++) {
    const first = (step * Math.PI * 2) / 64;
    const second = ((step + 1) * Math.PI * 2) / 64;
    values.push(...point(center, radius, first, height), ...point(center, radius, second, height));
  }
}

function verticalEdges(values, center, radius, bottom, top) {
  for (let step = 0; step < 8; step++) {
    const angle = (step * Math.PI * 2) / 8;
    values.push(...point(center, radius, angle, bottom), ...point(center, radius, angle, top));
  }
}

function point(center, radius, angle, height) {
  return [center.x + Math.cos(angle) * radius, height, center.z + Math.sin(angle) * radius];
}
