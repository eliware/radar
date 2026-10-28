export function airportAirspaceBands(airport) {
  const elevation = Number.isFinite(airport.elevationFeet) ? airport.elevationFeet : 0;
  const bands = [];
  if (airport.classB === "Y") {
    bands.push(
      { innerRadiusNm: 0, outerRadiusNm: 10, floorFeet: elevation, ceilingFeet: 10000 },
      { innerRadiusNm: 10, outerRadiusNm: 20, floorFeet: 3000, ceilingFeet: 10000 },
      { innerRadiusNm: 20, outerRadiusNm: 30, floorFeet: 6000, ceilingFeet: 10000 },
    );
  }
  if (airport.classC === "Y") {
    bands.push(
      { innerRadiusNm: 0, outerRadiusNm: 5, floorFeet: elevation, ceilingFeet: elevation + 4000 },
      {
        innerRadiusNm: 5,
        outerRadiusNm: 10,
        floorFeet: elevation + 1200,
        ceilingFeet: elevation + 4000,
      },
    );
  }
  if (airport.classD === "Y") {
    bands.push({
      innerRadiusNm: 0,
      outerRadiusNm: 5,
      floorFeet: elevation,
      ceilingFeet: elevation + 2500,
    });
  }
  return bands;
}
