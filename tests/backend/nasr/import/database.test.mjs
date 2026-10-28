import { DatabaseSync } from "node:sqlite";
import { expect, jest, test } from "@jest/globals";
import { importNasrDatabaseLifecycle } from "../../../../src/backend/nasr/import/database.mjs";
import { NASR_INDEXES, REQUIRED_COLUMNS } from "../../../../src/backend/nasr/indexes.mjs";

function createDatabase(columnsByTable = REQUIRED_COLUMNS) {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(columnsByTable)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  return database;
}

function retainOnClose(database) {
  return {
    exec: (...args) => database.exec(...args),
    prepare: (...args) => database.prepare(...args),
    close: jest.fn(),
  };
}

function makeDependencies(source, output, options = {}) {
  return {
    Database: jest.fn().mockReturnValueOnce(source).mockReturnValueOnce(output),
    exists: jest.fn(() => true),
    copy: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
    ...options,
  };
}

test("imports NASR and installs indexes into an output copy", () => {
  const source = retainOnClose(createDatabase());
  const imported = retainOnClose(createDatabase());
  const dependencies = makeDependencies(source, imported);
  expect(importNasrDatabaseLifecycle("input.sqlite", "output/NASR.sqlite", dependencies)).toEqual({
    output: expect.stringMatching(/output[\\/]NASR\.sqlite$/),
    indexes: NASR_INDEXES.length,
  });
  expect(
    imported.prepare("SELECT name FROM sqlite_master WHERE type = 'index'").all(),
  ).toHaveLength(NASR_INDEXES.length);
  expect(imported.prepare("PRAGMA integrity_check").get()).toEqual({ integrity_check: "ok" });
  expect(dependencies.copy).toHaveBeenCalledWith(
    expect.stringMatching(/input\.sqlite$/),
    expect.stringContaining(".tmp-"),
  );
  expect(dependencies.rename).toHaveBeenCalled();
});

test("cleans up the temporary copy when replacing the destination fails", () => {
  const dependencies = makeDependencies(
    retainOnClose(createDatabase()),
    retainOnClose(createDatabase()),
    {
      rename: jest.fn(() => {
        throw new Error("rename failed");
      }),
    },
  );
  expect(() =>
    importNasrDatabaseLifecycle("input.sqlite", "output/NASR.sqlite", dependencies),
  ).toThrow("rename failed");
  expect(dependencies.remove).toHaveBeenCalledWith(expect.stringContaining(".tmp-"), {
    force: true,
  });
});
