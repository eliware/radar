function createAirportDatabaseGuard(database, queries) {
  let closed = false;
  const guard =
    (query) =>
    (...args) => {
      if (closed) throw new Error("Airport database is closed.");
      return query(...args);
    };
  return {
    findBetween: guard(queries.findBetween),
    findNavaidsBetween: guard(queries.findNavaidsBetween),
    findIlsApproaches: guard(queries.findIlsApproaches),
    findProceduresBetween: guard(queries.findProceduresBetween),
    findAirwaysBetween: guard(queries.findAirwaysBetween),
    findBoundariesBetween: guard(queries.findBoundariesBetween),
    close() {
      if (closed) return;
      closed = true;
      database.close();
    },
  };
}
export default createAirportDatabaseGuard;
