export function verifyNasrQueryPlan(database, [name, query, parameters, indexes]) {
  const plan = database
    .prepare(`EXPLAIN QUERY PLAN ${query}`)
    .all(...parameters)
    .map((row) => row.detail)
    .join("\n");
  for (const index of indexes) {
    if (!plan.includes(index)) throw new Error(`NASR ${name} query plan does not use ${index}.`);
  }
}
