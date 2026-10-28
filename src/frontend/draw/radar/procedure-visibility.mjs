export function normalizeProcedureVisibility(visibility = { sidVisible: true, starVisible: true }) {
  if (typeof visibility === "boolean") return { sidVisible: visibility, starVisible: visibility };
  return visibility;
}
