export function radarReferenceData(references) {
  return {
    airports: references.airports ?? new Map(),
    navaids: references.navaids ?? new Map(),
    boundaries: references.boundaries ?? new Map(),
    ilsApproaches: references.ilsApproaches ?? new Map(),
    procedures: references.procedures ?? new Map(),
    airways: references.airways ?? new Map(),
  };
}
