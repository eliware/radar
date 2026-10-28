export function normalizeNasrIndexSql(sql) {
  return sql?.replace(/\s+/g, " ").trim().toUpperCase();
}
