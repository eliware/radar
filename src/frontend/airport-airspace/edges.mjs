export function airportAirspaceEdges(bands, groundFeet) {
  const radii = [
    ...new Set(bands.flatMap(({ innerRadiusNm, outerRadiusNm }) => [innerRadiusNm, outerRadiusNm])),
  ].sort((a, b) => a - b);
  const levels = [
    ...new Set(bands.flatMap(({ floorFeet, ceilingFeet }) => [floorFeet, ceilingFeet])),
  ].sort((a, b) => a - b);
  const rings = [];
  const walls = [];
  for (const level of levels) {
    if (level <= groundFeet) continue;
    const ranges = radialChanges(radii, bands, level - 0.01, level + 0.01);
    for (const [inner, outer] of ranges) {
      if (inner > 0) rings.push({ radius: inner, altitude: level });
      if (outer > 0) rings.push({ radius: outer, altitude: level });
    }
  }
  for (const radius of radii.filter((value) => value > 0)) {
    let start = null;
    for (let index = 0; index < levels.length - 1; index++) {
      const middle = (levels[index] + levels[index + 1]) / 2;
      const exposed =
        covered(radius - 0.001, middle, bands) !== covered(radius + 0.001, middle, bands);
      if (exposed && start === null) start = levels[index];
      if (start !== null && (!exposed || index === levels.length - 2)) {
        walls.push({ radius, floor: start, ceiling: exposed ? levels[index + 1] : levels[index] });
        start = null;
      }
    }
  }
  return { rings, walls };
}

function radialChanges(radii, bands, below, above) {
  const ranges = [];
  let start = null;
  for (let index = 0; index < radii.length - 1; index++) {
    const inner = radii[index];
    const outer = radii[index + 1];
    const middle = (inner + outer) / 2;
    if (covered(middle, below, bands) !== covered(middle, above, bands)) {
      if (start === null) start = inner;
      if (index === radii.length - 2) ranges.push([start, outer]);
    } else if (start !== null) {
      ranges.push([start, inner]);
      start = null;
    }
  }
  return ranges;
}

function covered(radius, altitude, bands) {
  return bands.some(
    (band) =>
      radius >= band.innerRadiusNm &&
      radius < band.outerRadiusNm &&
      altitude >= band.floorFeet &&
      altitude < band.ceilingFeet,
  );
}
