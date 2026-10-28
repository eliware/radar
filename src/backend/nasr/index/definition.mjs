export function parseNasrIndexDefinition(statement) {
  const [, name] = statement.match(/INDEX IF NOT EXISTS (\w+)/);
  const definition = statement.replace(" IF NOT EXISTS", "");
  return { name, definition: normalizeNasrIndexSql(definition) };
}

export function normalizeNasrIndexSql(sql) {
  return sql?.replace(/\s+/g, " ").trim().toUpperCase();
}
