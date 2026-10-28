import { expect, jest, test } from "@jest/globals";
import { importNasrDatabaseLifecycle } from "../../../../src/backend/nasr/import/database.mjs";
import { NASR_INDEXES } from "../../../../src/backend/nasr/index/definitions.mjs";
import { createNasrTestDatabase } from "../../../../test-fixtures/nasr-database.mjs";

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
  const source = retainOnClose(createNasrTestDatabase());
  const imported = retainOnClose(createNasrTestDatabase());
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
    retainOnClose(createNasrTestDatabase()),
    retainOnClose(createNasrTestDatabase()),
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

test("uses default output and filesystem dependencies when input is missing", () => {
  expect(() => importNasrDatabaseLifecycle("missing-nasr-input.sqlite")).toThrow(
    "Input NASR database not found",
  );
});
