import { drawRadarReferences } from "../../draw/radar/references.mjs";

export function drawAircraftOverlayReferences(context, references, project, visibility) {
  drawRadarReferences(
    context,
    references,
    project,
    visibility.ilsVisible,
    visibility.procedureVisibility,
    visibility.airwayVisibility,
    visibility.runwayVisibility,
    visibility.referenceVisibility,
    // The 3D shell supplies airspace geometry. Skip flat rings to prevent duplicate ground edges.
    false,
  );
}
