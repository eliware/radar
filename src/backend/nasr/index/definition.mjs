import { default as normalizeNasrIndexSql } from "./normalize-definition.mjs";

function parseNasrIndexDefinition(statement) {
  const [, name] = statement.match(/INDEX IF NOT EXISTS (\w+)/);
  const definition = statement.replace(" IF NOT EXISTS", "");
  return { name, definition: normalizeNasrIndexSql(definition) };
}
export default parseNasrIndexDefinition;
