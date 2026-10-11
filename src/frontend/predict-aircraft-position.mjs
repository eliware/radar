const FEET_PER_NAUTICAL_MILE = 6076.12;

export function predictAircraftPosition(position, aircraft) {
  const { trackDegrees, groundSpeedKnots } = aircraft;
  if (!Number.isFinite(trackDegrees) || !Number.isFinite(groundSpeedKnots)) return null;
  const predictionSeconds = 60;
  const distance = (groundSpeedKnots * predictionSeconds) / 3600;
  const track = (trackDegrees * Math.PI) / 180;
  const climbFeet = Number.isFinite(aircraft.verticalRateFeetPerMinute)
    ? (aircraft.verticalRateFeetPerMinute * predictionSeconds) / 60
    : 0;
  return {
    x: position.x + distance * Math.sin(track),
    y: position.y + climbFeet / FEET_PER_NAUTICAL_MILE,
    z: position.z - distance * Math.cos(track),
  };
}
