import { createOverlayProjection } from "./overlay/projection.mjs";
import { drawAircraftOverlayReferences } from "./overlay/references.mjs";
import { drawAircraftOverlayTargets } from "./overlay/aircraft.mjs";
import { drawAircraftOverlayScope } from "./overlay/scope.mjs";

export function createOverlayDrawer({ THREE, container, windowRef, canvas, context }) {
  const projection = createOverlayProjection({ THREE, container, windowRef, canvas, context });
  return function draw(
    aircraft,
    trails,
    location,
    elevationFeet,
    camera,
    range,
    connected = true,
    airports = new Map(),
    navaids = new Map(),
    boundaries = new Map(),
    ilsApproaches = new Map(),
    ilsVisible = true,
    procedures = new Map(),
    procedureVisibility = { sidVisible: true, starVisible: true },
    waterVisible = true,
    airways = new Map(),
    airwayVisibility = { Q: true, J: true, V: true },
    runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
    referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  ) {
    const { width, height, project, projectReference } = projection.prepare(
      camera,
      location,
      elevationFeet,
    );
    context.clearRect(0, 0, width, height);
    drawAircraftOverlayReferences(
      context,
      { airports, navaids, boundaries, ilsApproaches, procedures, airways },
      projectReference,
      { ilsVisible, procedureVisibility, airwayVisibility, runwayVisibility, referenceVisibility },
    );
    drawAircraftOverlayTargets(
      context,
      aircraft,
      trails,
      location,
      elevationFeet,
      project,
      connected,
      width,
      height,
    );
    drawAircraftOverlayScope(
      context,
      camera,
      location,
      elevationFeet,
      range,
      width,
      height,
      connected,
      {
        ilsVisible,
        procedureVisibility,
        waterVisible,
        airwayVisibility,
        runwayVisibility,
        referenceVisibility,
      },
    );
  };
}
